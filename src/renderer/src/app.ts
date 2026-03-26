import { ChatPanel } from './components/ChatPanel'
import { QuotePanel } from './components/QuotePanel'
import { ProjectForm } from './components/ProjectForm'
import type { Quote } from './types'

export class App {
  private chatPanel!: ChatPanel
  private quotePanel!: QuotePanel
  private projectForm!: ProjectForm
  private currentQuote: Quote | null = null
  private streamingMessageId: string | null = null
  private configPanel: HTMLElement | null = null

  async init(): Promise<void> {
    this.setupLayout()
    this.initComponents()
    this.setupApiListeners()
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
            <button class="btn btn-sm btn-ghost" id="settingsBtn" title="设置">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              设置
            </button>
          </div>
        </div>
        <div class="main-content">
          <div class="chat-container" id="chatContainer"></div>
          <div class="quote-container" id="quoteContainer"></div>
        </div>
      </div>
    `

    document.getElementById('settingsBtn')?.addEventListener('click', () => {
      this.toggleSettings()
    })
  }

  private initComponents(): void {
    const chatContainer = document.getElementById('chatContainer')!
    const quoteContainer = document.getElementById('quoteContainer')!

    this.chatPanel = new ChatPanel(chatContainer, (message) => {
      this.handleChatSend(message)
    })

    this.quotePanel = new QuotePanel(
      quoteContainer,
      () => this.handleExport(),
      () => this.projectForm.open(this.currentQuote || undefined)
    )

    this.projectForm = new ProjectForm((data) => {
      this.handleProjectInfoSubmit(data)
    })
  }

  private setupApiListeners(): void {
    window.api.chat.onStream((chunk) => {
      if (this.streamingMessageId) {
        this.chatPanel.appendStreamChunk(this.streamingMessageId, chunk)
      }
    })

    window.api.chat.onDone((fullText) => {
      if (this.streamingMessageId) {
        this.chatPanel.finalizeMessage(this.streamingMessageId, fullText)
        this.streamingMessageId = null
      }
      this.chatPanel.setStreaming(false)
    })

    window.api.chat.onError((error) => {
      if (this.streamingMessageId) {
        this.chatPanel.finalizeMessage(this.streamingMessageId, '')
        this.streamingMessageId = null
      }
      this.chatPanel.setStreaming(false)
      this.chatPanel.showError(`发生错误：${error}`)
    })

    window.api.chat.onToolCall((data) => {
      this.chatPanel.showToolCall(data.name, data.args, data.result)
    })

    window.api.quote.onUpdated((quote) => {
      this.currentQuote = quote
      this.quotePanel.update(quote)
    })
  }

  private async loadInitialState(): Promise<void> {
    try {
      const quote = await window.api.quote.get()
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

    try {
      await window.api.chat.send(message)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      this.chatPanel.showError(`发送失败：${errorMsg}`)
      this.chatPanel.setStreaming(false)
      this.streamingMessageId = null
    }
  }

  private async handleProjectInfoSubmit(data: Partial<Quote>): Promise<void> {
    try {
      const updatedQuote = await window.api.quote.setProjectInfo(data)
      this.currentQuote = updatedQuote
      this.quotePanel.update(updatedQuote)
    } catch (err) {
      console.error('Failed to set project info:', err)
    }
  }

  private async handleExport(): Promise<void> {
    try {
      const result = await window.api.quote.export()
      if (result.canceled) return

      if (result.success) {
        this.showToast(`报价单已导出到：${result.filePath}`, 'success')
      } else {
        this.showToast(`导出失败：${result.error}`, 'error')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      this.showToast(`导出失败：${errorMsg}`, 'error')
    }
  }

  private async toggleSettings(): Promise<void> {
    if (this.configPanel) {
      this.configPanel.remove()
      this.configPanel = null
      return
    }

    const config = await window.api.config.get()

    const panel = document.createElement('div')
    panel.className = 'settings-panel'
    panel.innerHTML = `
      <div class="settings-inner">
        <div class="settings-header">
          <h3>设置</h3>
          <button class="modal-close" id="closeSettings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="settings-body">
          <div class="form-group">
            <label>AI 模型</label>
            <input type="text" id="modelInput" class="form-input" value="${(config as { model?: string }).model || 'deepseek-chat'}" placeholder="deepseek-chat" />
          </div>
          <div class="form-group">
            <label>API 密钥</label>
            <input type="password" id="apiKeyInput" class="form-input" value="${(config as { apiKey?: string }).apiKey || ''}" placeholder="sk-..." />
          </div>
          <div class="form-group">
            <label>API 地址</label>
            <input type="text" id="baseURLInput" class="form-input" value="${(config as { baseURL?: string }).baseURL || 'https://api.deepseek.com/v1'}" placeholder="https://api.deepseek.com/v1" />
          </div>
        </div>
        <div class="settings-footer">
          <button class="btn btn-primary" id="saveSettings">保存</button>
        </div>
      </div>
    `

    document.body.appendChild(panel)
    this.configPanel = panel

    panel.querySelector('#closeSettings')?.addEventListener('click', () => {
      panel.remove()
      this.configPanel = null
    })

    panel.querySelector('#saveSettings')?.addEventListener('click', async () => {
      const model = (panel.querySelector('#modelInput') as HTMLInputElement).value.trim()
      const apiKey = (panel.querySelector('#apiKeyInput') as HTMLInputElement).value.trim()
      const baseURL = (panel.querySelector('#baseURLInput') as HTMLInputElement).value.trim()

      await window.api.config.set({ model, apiKey, baseURL })
      panel.remove()
      this.configPanel = null
      this.showToast('设置已保存', 'success')
    })
  }

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
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
