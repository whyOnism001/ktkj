import { ChatPanel } from './components/ChatPanel'
import { QuotePanel } from './components/QuotePanel'
import { ProjectForm } from './components/ProjectForm'
import { getSessionId, newSession } from './session'
import { getQuote, startChat, getExportUrl } from './api'
import type { Quote } from './types'

export class App {
  private chatPanel!: ChatPanel
  private quotePanel!: QuotePanel
  private projectForm!: ProjectForm
  private currentQuote: Quote | null = null
  private streamingMessageId: string | null = null
  private sessionId: string

  constructor() {
    this.sessionId = getSessionId()
  }

  async init(): Promise<void> {
    this.setupLayout()
    this.initComponents()
    await this.loadInitialState()
  }

  private setupLayout(): void {
    document.getElementById('app')!.innerHTML = `
      <div class="app-container">
        <div class="top-bar">
          <div class="top-bar-left">
            <div class="app-logo">
              <span class="logo-text">开投智云</span>
              <span class="logo-sub">AI 报价助手</span>
            </div>
          </div>
          <div class="top-bar-right">
            <span class="session-id" title="当前会话ID">会话: ${this.sessionId.slice(0, 8)}...</span>
          </div>
        </div>
        <div class="main-content">
          <div class="chat-container" id="chatContainer"></div>
          <div class="quote-container" id="quoteContainer"></div>
        </div>
        <div class="status-bar" id="statusBar">就绪</div>
      </div>
    `
  }

  private initComponents(): void {
    const chatContainer = document.getElementById('chatContainer')!
    const quoteContainer = document.getElementById('quoteContainer')!

    this.chatPanel = new ChatPanel(chatContainer, (message) => {
      void this.handleChatSend(message)
    })

    this.quotePanel = new QuotePanel(
      quoteContainer,
      this.sessionId,
      () => this.handleExport(),
      () => this.projectForm.open(this.currentQuote || undefined),
      () => this.handleNewSession()
    )

    this.projectForm = new ProjectForm(this.sessionId, (quote) => {
      this.currentQuote = quote
      this.quotePanel.update(quote)
    })
  }

  private async loadInitialState(): Promise<void> {
    try {
      const { quote } = await getQuote(this.sessionId)
      this.currentQuote = quote
      this.quotePanel.update(quote)
    } catch (err) {
      console.error('Failed to load initial state:', err)
    }
  }

  private async handleChatSend(message: string): Promise<void> {
    this.chatPanel.addUserMessage(message)
    this.chatPanel.setStreaming(true)
    this.streamingMessageId = this.chatPanel.addAssistantMessage()
    this.setStatus('AI 思考中...')

    startChat(this.sessionId, message, {
      onText: (chunk) => {
        if (this.streamingMessageId) {
          this.chatPanel.appendStreamChunk(this.streamingMessageId, chunk)
        }
      },
      onToolCall: (name, args) => {
        this.chatPanel.showToolCall(name, args)
        this.setStatus(`执行工具: ${name}`)
      },
      onToolResult: (name, result) => {
        this.chatPanel.updateToolResult(name, result)
      },
      onQuoteUpdated: (quote) => {
        this.currentQuote = quote
        this.quotePanel.update(quote)
      },
      onDone: () => {
        if (this.streamingMessageId) {
          // The full text has been streamed chunk by chunk; finalize by re-rendering
          const contentEl = document.getElementById(`content-${this.streamingMessageId}`)
          if (contentEl) {
            const text = contentEl.textContent || ''
            this.chatPanel.finalizeMessage(this.streamingMessageId, text)
          }
          this.streamingMessageId = null
        }
        this.chatPanel.setStreaming(false)
        this.setStatus('就绪')
      },
      onError: (msg) => {
        if (this.streamingMessageId) {
          this.chatPanel.finalizeMessage(this.streamingMessageId, '')
          this.streamingMessageId = null
        }
        this.chatPanel.setStreaming(false)
        this.chatPanel.showError(`发生错误：${msg}`)
        this.setStatus('错误')
      }
    })
  }

  private handleExport(): void {
    const url = getExportUrl(this.sessionId)
    window.open(url, '_blank')
  }

  private handleNewSession(): void {
    this.sessionId = newSession()
    window.location.reload()
  }

  private setStatus(text: string): void {
    const statusBar = document.getElementById('statusBar')
    if (statusBar) statusBar.textContent = text
  }

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => toast.classList.add('toast-show'), 10)
    setTimeout(() => {
      toast.classList.remove('toast-show')
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }
}
