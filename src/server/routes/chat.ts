import { Router, Request, Response } from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getSession, saveSession, createDefaultQuote, StoredMessage } from '../db/index'
import { LLMClient } from '../llm/client'
import { getCatalogService } from '../services/catalog'
import { getMatcherService } from '../services/matcher'
import { calculateItemSubtotal, calculateQuoteTotals } from '../services/calculator'
import type { Quote, QuoteItem } from '../types'

const router = Router()

function loadConfig(): { apiKey: string; baseURL: string; model: string } {
  try {
    const raw = readFileSync(join(process.cwd(), 'config.json'), 'utf-8')
    return JSON.parse(raw) as { apiKey: string; baseURL: string; model: string }
  } catch {
    return { apiKey: '', baseURL: 'https://api.deepseek.com/v1', model: 'deepseek-chat' }
  }
}

function send(res: Response, event: object): void {
  res.write(`data: ${JSON.stringify(event)}\n\n`)
}

router.post('/', async (req: Request, res: Response) => {
  const { sessionId, message } = req.body as { sessionId: string; message: string }

  if (!sessionId || !message) {
    res.status(400).json({ error: 'sessionId and message are required' })
    return
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    // Load or create session
    let session = getSession(sessionId)
    if (!session) {
      const defaultQuote = createDefaultQuote(sessionId)
      session = {
        id: sessionId,
        messages: [],
        quote: defaultQuote,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    }

    // Append user message
    const userMsg: StoredMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: Date.now()
    }
    session.messages.push(userMsg)

    // Build history for LLM (only user/assistant messages)
    const history = session.messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))

    const config = loadConfig()
    const llm = new LLMClient(config)
    const catalog = getCatalogService()
    const matcher = getMatcherService()
    let currentQuote = { ...session.quote }

    // Tool executor
    async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
      if (name === 'search_catalog') {
        const query = args.query as string
        const results = catalog.search(query)
        return JSON.stringify({
          count: results.length,
          items: results.slice(0, 10)
        })
      }

      if (name === 'add_quote_item') {
        const serviceCode = args.serviceCode as string
        const item = catalog.findByCode(serviceCode)
        if (!item) {
          return JSON.stringify({ success: false, error: `未找到服务代码: ${serviceCode}` })
        }

        const quantity = (args.quantity as number) || 1
        const months = (args.months as number) || currentQuote.months
        const configDesc = args.configDesc as string | undefined

        const quoteItem: QuoteItem = {
          serviceCode: item.code,
          serviceName: item.name,
          specs: item.specs,
          configDesc,
          quantity,
          unitPrice: item.unitPrice,
          months,
          discountable: item.discountable,
          subtotal: item.unitPrice * quantity * months
        }

        currentQuote.items.push(quoteItem)
        recalcTotals(currentQuote)

        send(res, { type: 'quote_updated', quote: currentQuote })
        return JSON.stringify({
          success: true,
          message: `已添加 ${item.name}，小计 ¥${quoteItem.subtotal.toFixed(2)}`
        })
      }

      if (name === 'update_quote_item') {
        const index = args.index as number
        if (index < 0 || index >= currentQuote.items.length) {
          return JSON.stringify({ success: false, error: '项目索引超出范围' })
        }

        const item = currentQuote.items[index]
        if (args.quantity !== undefined) item.quantity = args.quantity as number
        if (args.configDesc !== undefined) item.configDesc = args.configDesc as string
        if (args.months !== undefined) item.months = args.months as number
        item.subtotal = calculateItemSubtotal(item)

        recalcTotals(currentQuote)
        send(res, { type: 'quote_updated', quote: currentQuote })
        return JSON.stringify({ success: true, message: `已更新 ${item.serviceName}` })
      }

      if (name === 'remove_quote_item') {
        const index = args.index as number
        if (index < 0 || index >= currentQuote.items.length) {
          return JSON.stringify({ success: false, error: '项目索引超出范围' })
        }

        const removed = currentQuote.items.splice(index, 1)[0]
        recalcTotals(currentQuote)
        send(res, { type: 'quote_updated', quote: currentQuote })
        return JSON.stringify({ success: true, message: `已删除 ${removed.serviceName}` })
      }

      if (name === 'match_external_list') {
        const items = args.items as Array<{ name: string; specs?: string }>
        const result = matcher.match(items)
        return JSON.stringify(result)
      }

      if (name === 'generate_quote') {
        currentQuote.phase = 'preview'
        recalcTotals(currentQuote)
        send(res, { type: 'quote_updated', quote: currentQuote })
        return JSON.stringify({
          success: true,
          message: '报价单已生成',
          totalBeforeDiscount: currentQuote.totalBeforeDiscount,
          totalAfterDiscount: currentQuote.totalAfterDiscount,
          itemCount: currentQuote.items.length
        })
      }

      return JSON.stringify({ success: false, error: `Unknown tool: ${name}` })
    }

    let assistantText = ''

    assistantText = await llm.chat(
      history,
      currentQuote,
      (chunk) => {
        send(res, { type: 'text', content: chunk })
      },
      (toolName, toolArgs) => {
        send(res, { type: 'tool_call', name: toolName, args: toolArgs })
      },
      (toolName, result) => {
        send(res, { type: 'tool_result', name: toolName, result })
      },
      executeTool
    )

    // Save assistant message and updated quote
    const assistantMsg: StoredMessage = {
      id: `${Date.now()}-assistant`,
      role: 'assistant',
      content: assistantText,
      timestamp: Date.now()
    }
    session.messages.push(assistantMsg)
    session.quote = currentQuote

    saveSession(sessionId, session.messages, currentQuote)

    send(res, { type: 'done' })
    res.end()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    send(res, { type: 'error', message })
    res.end()
  }
})

function recalcTotals(quote: Quote): void {
  const totals = calculateQuoteTotals(quote.items, quote.discountRate)
  quote.totalBeforeDiscount = totals.totalBeforeDiscount
  quote.totalAfterDiscount = totals.totalAfterDiscount
}

export default router
