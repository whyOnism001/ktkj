import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import { join } from 'path'
import { readFileSync } from 'fs'
import { LLMClient } from './llm/client'
import { CatalogService } from './services/catalog'
import { MatcherService } from './services/matcher'
import { XlsxGenerator } from './services/xlsx-gen'
import { QuoteState } from './state/quote'
import { HistoryStore } from './state/store'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    title: '开投智云 AI 报价助手',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Load config
function loadConfig() {
  try {
    const configPath = join(app.getAppPath(), 'config.json')
    const raw = readFileSync(configPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {
      provider: 'deepseek',
      apiKey: '',
      baseURL: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat'
    }
  }
}

// Initialize services
const catalogService = new CatalogService()
const matcherService = new MatcherService()
const quoteState = new QuoteState()
const historyStore = new HistoryStore()
let llmClient: LLMClient | null = null
let currentConfig = loadConfig()

function getOrCreateLLMClient(): LLMClient {
  if (!llmClient) {
    llmClient = new LLMClient(currentConfig)
  }
  return llmClient
}

// Tool execution handler
async function executeTool(
  toolName: string,
  toolArgs: Record<string, unknown>
): Promise<string> {
  switch (toolName) {
    case 'search_catalog': {
      const query = toolArgs.query as string
      const results = catalogService.search(query)
      if (results.length === 0) {
        return JSON.stringify({ found: false, message: '未找到匹配的服务', results: [] })
      }
      return JSON.stringify({ found: true, count: results.length, results })
    }

    case 'add_quote_item': {
      const { serviceCode, quantity, configDesc, months } = toolArgs as {
        serviceCode: string
        quantity: number
        configDesc?: string
        months?: number
      }
      const item = catalogService.findByCode(serviceCode)
      if (!item) {
        return JSON.stringify({ success: false, error: `未找到服务代码: ${serviceCode}` })
      }
      const quote = quoteState.getQuote()
      const effectiveMonths = months ?? quote.months ?? 1
      quoteState.addItem({
        serviceCode: item.code,
        serviceName: item.name,
        specs: item.specs,
        configDesc,
        quantity,
        unitPrice: item.unitPrice,
        months: effectiveMonths,
        discountable: item.discountable,
        subtotal: item.unitPrice * quantity * effectiveMonths
      })
      const updatedQuote = quoteState.getQuote()
      if (mainWindow) {
        mainWindow.webContents.send('quote:updated', updatedQuote)
      }
      return JSON.stringify({
        success: true,
        message: `已添加 ${item.name} x${quantity}`,
        item: { name: item.name, quantity, unitPrice: item.unitPrice, months: effectiveMonths }
      })
    }

    case 'update_quote_item': {
      const { index, quantity, configDesc, months } = toolArgs as {
        index: number
        quantity?: number
        configDesc?: string
        months?: number
      }
      quoteState.updateItem(index, { quantity, configDesc, months })
      const updatedQuote = quoteState.getQuote()
      if (mainWindow) {
        mainWindow.webContents.send('quote:updated', updatedQuote)
      }
      return JSON.stringify({ success: true, message: `已更新第${index + 1}项` })
    }

    case 'remove_quote_item': {
      const { index } = toolArgs as { index: number }
      quoteState.removeItem(index)
      const updatedQuote = quoteState.getQuote()
      if (mainWindow) {
        mainWindow.webContents.send('quote:updated', updatedQuote)
      }
      return JSON.stringify({ success: true, message: `已删除第${index + 1}项` })
    }

    case 'match_external_list': {
      const { items } = toolArgs as { items: Array<{ name: string; specs?: string }> }
      const result = matcherService.match(items)
      return JSON.stringify(result)
    }

    case 'generate_quote': {
      const quote = quoteState.getQuote()
      if (mainWindow) {
        mainWindow.webContents.send('quote:updated', quote)
      }
      return JSON.stringify({
        success: true,
        quote: {
          projectName: quote.projectName,
          clientOrg: quote.clientOrg,
          providerOrg: quote.providerOrg,
          months: quote.months,
          discountRate: quote.discountRate,
          itemCount: quote.items.length,
          totalBeforeDiscount: quote.totalBeforeDiscount,
          totalAfterDiscount: quote.totalAfterDiscount
        }
      })
    }

    default:
      return JSON.stringify({ error: `未知工具: ${toolName}` })
  }
}

// Message history per session
let messageHistory: Array<{ role: string; content: string }> = []

// IPC Handlers
ipcMain.handle('chat:send', async (event, message: string) => {
  if (!mainWindow) return

  try {
    const client = getOrCreateLLMClient()
    messageHistory.push({ role: 'user', content: message })

    await client.chat(
      messageHistory,
      quoteState.getQuote(),
      // onStream
      (chunk: string) => {
        mainWindow?.webContents.send('chat:stream', chunk)
      },
      // onToolCall
      async (toolName: string, toolArgs: Record<string, unknown>) => {
        const result = await executeTool(toolName, toolArgs)
        mainWindow?.webContents.send('chat:tool-call', {
          name: toolName,
          args: toolArgs,
          result
        })
        return result
      },
      // onDone
      (fullText: string) => {
        messageHistory.push({ role: 'assistant', content: fullText })
        mainWindow?.webContents.send('chat:done', fullText)
      }
    )
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    mainWindow.webContents.send('chat:error', errorMsg)
  }
})

ipcMain.handle('quote:get', async () => {
  return quoteState.getQuote()
})

ipcMain.handle('quote:set-project-info', async (_, info) => {
  quoteState.setProjectInfo(info)
  const updatedQuote = quoteState.getQuote()
  if (mainWindow) {
    mainWindow.webContents.send('quote:updated', updatedQuote)
  }
  return updatedQuote
})

ipcMain.handle('quote:export', async () => {
  if (!mainWindow) return { success: false, error: 'No window' }

  const quote = quoteState.getQuote()
  if (quote.items.length === 0) {
    return { success: false, error: '报价单中没有项目' }
  }

  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: '导出报价单',
    defaultPath: `${quote.projectName || '报价单'}_${new Date().toISOString().slice(0, 10)}.xlsx`,
    filters: [{ name: 'Excel文件', extensions: ['xlsx'] }]
  })

  if (canceled || !filePath) {
    return { success: false, canceled: true }
  }

  try {
    const gen = new XlsxGenerator()
    await gen.generate(quote, filePath)
    historyStore.saveQuote(quote)
    return { success: true, filePath }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return { success: false, error: errorMsg }
  }
})

ipcMain.handle('history:list', async () => {
  return historyStore.listQuotes()
})

ipcMain.handle('history:get', async (_, id: string) => {
  return historyStore.getQuote(id)
})

ipcMain.handle('config:get', async () => {
  return currentConfig
})

ipcMain.handle('config:set', async (_, cfg) => {
  currentConfig = { ...currentConfig, ...cfg }
  llmClient = null // Reset client so it picks up new config
  return currentConfig
})

ipcMain.handle('chat:clear', async () => {
  messageHistory = []
  quoteState.reset()
  return true
})
