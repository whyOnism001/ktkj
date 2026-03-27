import type { Quote, ChatMessage, SSEEvent } from './types'

export interface QuoteWithMessages {
  quote: Quote
  messages: ChatMessage[]
}

export async function getQuote(sessionId: string): Promise<QuoteWithMessages> {
  const res = await fetch(`/api/quote/${sessionId}`)
  if (!res.ok) throw new Error(`Failed to fetch quote: ${res.statusText}`)
  return res.json() as Promise<QuoteWithMessages>
}

export async function updateQuoteInfo(sessionId: string, info: Partial<Quote>): Promise<Quote> {
  const res = await fetch(`/api/quote/${sessionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(info)
  })
  if (!res.ok) throw new Error(`Failed to update quote: ${res.statusText}`)
  return res.json() as Promise<Quote>
}

export async function deleteQuote(sessionId: string): Promise<void> {
  await fetch(`/api/quote/${sessionId}`, { method: 'DELETE' })
}

export function getExportUrl(sessionId: string): string {
  return `/api/export/${sessionId}`
}

export interface ChatCallbacks {
  onText(chunk: string): void
  onToolCall(name: string, args: unknown): void
  onToolResult(name: string, result: unknown): void
  onQuoteUpdated(quote: Quote): void
  onDone(): void
  onError(msg: string): void
}

export function startChat(
  sessionId: string,
  message: string,
  callbacks: ChatCallbacks
): AbortController {
  const controller = new AbortController()

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message }),
    signal: controller.signal
  })
    .then(async (res) => {
      if (!res.ok) {
        callbacks.onError(`HTTP ${res.status}: ${res.statusText}`)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        callbacks.onError('No response body')
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (!data) continue

            try {
              const event = JSON.parse(data) as SSEEvent

              switch (event.type) {
                case 'text':
                  if (event.content) callbacks.onText(event.content)
                  break
                case 'tool_call':
                  if (event.name) callbacks.onToolCall(event.name, event.args)
                  break
                case 'tool_result':
                  if (event.name) callbacks.onToolResult(event.name, event.result)
                  break
                case 'quote_updated':
                  if (event.quote) callbacks.onQuoteUpdated(event.quote)
                  break
                case 'done':
                  callbacks.onDone()
                  break
                case 'error':
                  callbacks.onError(event.message || 'Unknown error')
                  break
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error && err.name === 'AbortError') return
      callbacks.onError(err instanceof Error ? err.message : String(err))
    })

  return controller
}
