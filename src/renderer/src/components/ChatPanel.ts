import type { ChatMessage } from '../types'

export class ChatPanel {
  private container: HTMLElement
  private messagesEl!: HTMLElement
  private inputEl!: HTMLTextAreaElement
  private sendBtn!: HTMLButtonElement
  private onSend: (message: string) => void
  private isStreaming = false

  constructor(container: HTMLElement, onSend: (message: string) => void) {
    this.container = container
    this.onSend = onSend
    this.render()
    this.bindEvents()
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="chat-panel">
        <div class="chat-header">
          <div class="chat-header-title">
            <span class="chat-icon">AI</span>
            <span>开投智云 AI 报价助手</span>
          </div>
          <div class="chat-header-actions">
            <button class="btn btn-sm btn-ghost" id="clearChatBtn" title="清空对话">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              清空
            </button>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="chat-welcome">
            <div class="welcome-logo">开投智云</div>
            <h2>AI 报价助手</h2>
            <p>您好！我是开投智云AI报价助手。</p>
            <p>我可以帮您：</p>
            <ul>
              <li>根据您的业务需求推荐合适的云服务方案</li>
              <li>将其他云服务商的清单匹配到我们的服务目录</li>
              <li>生成专业的报价单</li>
            </ul>
            <p class="welcome-hint">请先点击右上角"填写项目信息"，然后告诉我您的需求。</p>
          </div>
        </div>
        <div class="chat-input-area">
          <div class="chat-input-wrapper">
            <textarea
              id="chatInput"
              class="chat-input"
              placeholder="描述您的业务需求，或粘贴其他云服务商的服务清单..."
              rows="3"
            ></textarea>
            <button id="sendBtn" class="send-btn" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="chat-input-hint">按 Enter 发送，Shift+Enter 换行</div>
        </div>
      </div>
    `

    this.messagesEl = this.container.querySelector('#chatMessages')!
    this.inputEl = this.container.querySelector('#chatInput')!
    this.sendBtn = this.container.querySelector('#sendBtn')!
  }

  private bindEvents(): void {
    this.inputEl.addEventListener('input', () => {
      const hasText = this.inputEl.value.trim().length > 0
      this.sendBtn.disabled = !hasText || this.isStreaming
    })

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (!this.sendBtn.disabled) {
          this.handleSend()
        }
      }
    })

    this.sendBtn.addEventListener('click', () => {
      this.handleSend()
    })

    const clearBtn = this.container.querySelector('#clearChatBtn')
    clearBtn?.addEventListener('click', () => {
      if (confirm('确定要清空当前对话和报价单吗？')) {
        window.api.chat.clear().then(() => {
          this.clearMessages()
          this.showWelcome()
        })
      }
    })
  }

  private handleSend(): void {
    const message = this.inputEl.value.trim()
    if (!message || this.isStreaming) return

    this.inputEl.value = ''
    this.sendBtn.disabled = true
    this.onSend(message)
  }

  addUserMessage(message: string): void {
    const msgEl = this.createMessageElement({
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now()
    })
    this.removeWelcome()
    this.messagesEl.appendChild(msgEl)
    this.scrollToBottom()
  }

  addAssistantMessage(): string {
    const id = `msg-${Date.now()}`
    const msgEl = document.createElement('div')
    msgEl.className = 'chat-message assistant'
    msgEl.id = id
    msgEl.innerHTML = `
      <div class="message-avatar">AI</div>
      <div class="message-body">
        <div class="message-content streaming" id="content-${id}">
          <span class="typing-indicator">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
    `
    this.messagesEl.appendChild(msgEl)
    this.scrollToBottom()
    return id
  }

  appendStreamChunk(messageId: string, chunk: string): void {
    const contentEl = document.getElementById(`content-${messageId}`)
    if (!contentEl) return

    // Remove typing indicator on first chunk
    const typingIndicator = contentEl.querySelector('.typing-indicator')
    if (typingIndicator) {
      typingIndicator.remove()
      contentEl.innerHTML = ''
    }

    // Append text with basic markdown-like rendering
    const span = document.createElement('span')
    span.textContent = chunk
    contentEl.appendChild(span)
    this.scrollToBottom()
  }

  finalizeMessage(messageId: string, fullText: string): void {
    const contentEl = document.getElementById(`content-${messageId}`)
    if (!contentEl) return

    contentEl.classList.remove('streaming')
    // Render with markdown
    contentEl.innerHTML = this.renderMarkdown(fullText)
    this.scrollToBottom()
  }

  showToolCall(name: string, args: unknown, result: string): void {
    const toolEl = document.createElement('div')
    toolEl.className = 'tool-call-result'

    const toolLabels: Record<string, string> = {
      search_catalog: '搜索服务目录',
      add_quote_item: '添加报价项目',
      update_quote_item: '更新报价项目',
      remove_quote_item: '删除报价项目',
      match_external_list: '匹配服务清单',
      generate_quote: '生成报价汇总'
    }

    const label = toolLabels[name] || name
    let resultSummary = ''

    try {
      const parsed = JSON.parse(result)
      if (parsed.success === false && parsed.error) {
        resultSummary = `失败：${parsed.error}`
      } else if (parsed.message) {
        resultSummary = parsed.message
      } else if (parsed.found === false) {
        resultSummary = '未找到匹配服务'
      } else if (parsed.count) {
        resultSummary = `找到 ${parsed.count} 个结果`
      } else if (parsed.summary) {
        const s = parsed.summary
        resultSummary = `共 ${s.total} 项，匹配 ${s.matchedCount}，未匹配 ${s.unmatchedCount}`
      } else if (parsed.success) {
        resultSummary = '成功'
      }
    } catch {
      resultSummary = ''
    }

    toolEl.innerHTML = `
      <div class="tool-call-header">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
        <span>${label}</span>
        ${resultSummary ? `<span class="tool-result-summary">${resultSummary}</span>` : ''}
      </div>
    `
    this.messagesEl.appendChild(toolEl)
    this.scrollToBottom()
  }

  showError(error: string): void {
    const errEl = document.createElement('div')
    errEl.className = 'chat-error-msg'
    errEl.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      <span>${error}</span>
    `
    this.messagesEl.appendChild(errEl)
    this.scrollToBottom()
  }

  setStreaming(streaming: boolean): void {
    this.isStreaming = streaming
    const hasText = this.inputEl.value.trim().length > 0
    this.sendBtn.disabled = !hasText || streaming
    this.inputEl.disabled = streaming
  }

  private createMessageElement(msg: ChatMessage): HTMLElement {
    const el = document.createElement('div')
    el.className = `chat-message ${msg.role}`
    el.id = `msg-${msg.id}`

    if (msg.role === 'user') {
      el.innerHTML = `
        <div class="message-body">
          <div class="message-content">${this.escapeHtml(msg.content)}</div>
        </div>
        <div class="message-avatar user-avatar">我</div>
      `
    } else {
      el.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-body">
          <div class="message-content">${this.renderMarkdown(msg.content)}</div>
        </div>
      `
    }

    return el
  }

  private clearMessages(): void {
    this.messagesEl.innerHTML = ''
  }

  private showWelcome(): void {
    const welcomeEl = document.createElement('div')
    welcomeEl.className = 'chat-welcome'
    welcomeEl.innerHTML = `
      <div class="welcome-logo">开投智云</div>
      <h2>AI 报价助手</h2>
      <p>对话已清空，可以重新开始。</p>
      <p class="welcome-hint">请先点击右上角"填写项目信息"，然后告诉我您的需求。</p>
    `
    this.messagesEl.appendChild(welcomeEl)
  }

  private removeWelcome(): void {
    const welcome = this.messagesEl.querySelector('.chat-welcome')
    if (welcome) welcome.remove()
  }

  private scrollToBottom(): void {
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>')
  }

  private renderMarkdown(text: string): string {
    if (!text) return ''

    let html = this.escapeHtml(text)

    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

    // Italic: *text*
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

    // Code: `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>')
    html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>')

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>')
    html = html.replace(/\n/g, '<br>')

    return `<p>${html}</p>`
  }
}
