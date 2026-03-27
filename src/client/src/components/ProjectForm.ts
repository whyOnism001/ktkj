import type { Quote } from '../types'
import { updateQuoteInfo } from '../api'

export class ProjectForm {
  private overlay: HTMLElement | null = null
  private sessionId: string
  private onSaved: (quote: Quote) => void

  constructor(sessionId: string, onSaved: (quote: Quote) => void) {
    this.sessionId = sessionId
    this.onSaved = onSaved
  }

  open(quote?: Quote): void {
    this.createOverlay(quote)
  }

  close(): void {
    if (this.overlay) {
      this.overlay.classList.add('closing')
      setTimeout(() => {
        this.overlay?.remove()
        this.overlay = null
      }, 200)
    }
  }

  private createOverlay(q?: Quote): void {
    if (this.overlay) {
      this.overlay.remove()
    }

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>填写项目信息</h3>
          <button class="modal-close" id="modalClose">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form id="projectForm">
            <div class="form-group">
              <label for="projectName">项目名称 <span class="required">*</span></label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                class="form-input"
                placeholder="例如：XX智慧城市云平台"
                value="${q?.projectName || ''}"
                required
              />
            </div>
            <div class="form-group">
              <label for="clientOrg">客户单位</label>
              <input
                type="text"
                id="clientOrg"
                name="clientOrg"
                class="form-input"
                placeholder="例如：XX市数据局"
                value="${q?.clientOrg || ''}"
              />
            </div>
            <div class="form-group">
              <label for="providerOrg">服务商</label>
              <input
                type="text"
                id="providerOrg"
                name="providerOrg"
                class="form-input"
                placeholder="服务提供商名称"
                value="${q?.providerOrg || '开投智云'}"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="months">服务月数</label>
                <input
                  type="number"
                  id="months"
                  name="months"
                  class="form-input"
                  min="1"
                  max="120"
                  value="${q?.months ?? 12}"
                />
              </div>
              <div class="form-group">
                <label for="discountRate">折扣率 (%)</label>
                <input
                  type="number"
                  id="discountRate"
                  name="discountRate"
                  class="form-input"
                  min="1"
                  max="100"
                  value="${q?.discountRate ?? 85}"
                />
                <span class="form-hint">100 = 不打折，85 = 8.5折</span>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="cancelBtn">取消</button>
          <button class="btn btn-primary" id="confirmBtn">确认</button>
        </div>
      </div>
    `

    document.body.appendChild(overlay)
    this.overlay = overlay

    overlay.querySelector('#modalClose')?.addEventListener('click', () => this.close())
    overlay.querySelector('#cancelBtn')?.addEventListener('click', () => this.close())
    overlay.querySelector('#confirmBtn')?.addEventListener('click', () => {
      void this.handleSubmit()
    })

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close()
    })

    overlay.querySelector('#projectForm')?.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        e.preventDefault()
        void this.handleSubmit()
      }
    })

    setTimeout(() => {
      const firstInput = overlay.querySelector('#projectName') as HTMLInputElement
      firstInput?.focus()
    }, 100)
  }

  private async handleSubmit(): Promise<void> {
    if (!this.overlay) return

    const form = this.overlay.querySelector('#projectForm') as HTMLFormElement
    const projectName = (form.querySelector('#projectName') as HTMLInputElement).value.trim()

    if (!projectName) {
      const input = form.querySelector('#projectName') as HTMLInputElement
      input.classList.add('input-error')
      input.focus()
      return
    }

    const clientOrg = (form.querySelector('#clientOrg') as HTMLInputElement).value.trim()
    const providerOrg =
      (form.querySelector('#providerOrg') as HTMLInputElement).value.trim() || '开投智云'
    const monthsVal = parseInt((form.querySelector('#months') as HTMLInputElement).value) || 12
    const discountVal =
      parseInt((form.querySelector('#discountRate') as HTMLInputElement).value) || 85

    const data: Partial<Quote> = {
      projectName,
      clientOrg,
      providerOrg,
      months: Math.max(1, Math.min(120, monthsVal)),
      discountRate: Math.max(1, Math.min(100, discountVal))
    }

    try {
      const updatedQuote = await updateQuoteInfo(this.sessionId, data)
      this.onSaved(updatedQuote)
      this.close()
    } catch (err) {
      console.error('Failed to save project info:', err)
    }
  }
}
