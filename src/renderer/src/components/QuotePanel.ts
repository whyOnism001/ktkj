import type { Quote, QuoteItem } from '../types'

export class QuotePanel {
  private container: HTMLElement
  private quote: Quote | null = null
  private onExport: () => void
  private onOpenProjectForm: () => void

  constructor(
    container: HTMLElement,
    onExport: () => void,
    onOpenProjectForm: () => void
  ) {
    this.container = container
    this.onExport = onExport
    this.onOpenProjectForm = onOpenProjectForm
    this.render()
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="quote-panel">
        <div class="quote-header">
          <div class="quote-header-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>报价单</span>
          </div>
          <div class="quote-header-actions">
            <button class="btn btn-sm btn-outline" id="editProjectBtn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              项目信息
            </button>
            <button class="btn btn-sm btn-primary" id="exportBtn" disabled>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              导出Excel
            </button>
          </div>
        </div>

        <div class="quote-meta" id="quoteMeta">
          <div class="quote-meta-empty">
            <p>尚未填写项目信息</p>
            <button class="btn btn-sm btn-primary" id="startProjectBtn">填写项目信息</button>
          </div>
        </div>

        <div class="quote-items-container">
          <div class="quote-items" id="quoteItems">
            <div class="quote-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <p>暂无报价项目</p>
              <p class="quote-empty-hint">通过左侧对话添加服务</p>
            </div>
          </div>
        </div>

        <div class="quote-summary" id="quoteSummary" style="display:none">
          <div class="summary-row">
            <span>原价合计</span>
            <span id="totalBefore">¥0.00</span>
          </div>
          <div class="summary-row discount-row">
            <span>折扣率</span>
            <span id="discountRate">85%</span>
          </div>
          <div class="summary-row total-row">
            <span>折后合计</span>
            <strong id="totalAfter">¥0.00</strong>
          </div>
        </div>
      </div>
    `

    this.bindEvents()
  }

  private bindEvents(): void {
    const editBtn = this.container.querySelector('#editProjectBtn')
    editBtn?.addEventListener('click', () => this.onOpenProjectForm())

    const startBtn = this.container.querySelector('#startProjectBtn')
    startBtn?.addEventListener('click', () => this.onOpenProjectForm())

    const exportBtn = this.container.querySelector('#exportBtn')
    exportBtn?.addEventListener('click', () => this.onExport())
  }

  update(quote: Quote): void {
    this.quote = quote
    this.updateMeta(quote)
    this.updateItems(quote.items)
    this.updateSummary(quote)

    const exportBtn = this.container.querySelector('#exportBtn') as HTMLButtonElement
    if (exportBtn) {
      exportBtn.disabled = quote.items.length === 0
    }
  }

  private updateMeta(quote: Quote): void {
    const metaEl = this.container.querySelector('#quoteMeta')!

    if (!quote.projectName && !quote.clientOrg) {
      metaEl.innerHTML = `
        <div class="quote-meta-empty">
          <p>尚未填写项目信息</p>
          <button class="btn btn-sm btn-primary" id="startProjectBtn2">填写项目信息</button>
        </div>
      `
      const startBtn = metaEl.querySelector('#startProjectBtn2')
      startBtn?.addEventListener('click', () => this.onOpenProjectForm())
      return
    }

    metaEl.innerHTML = `
      <div class="quote-meta-info">
        <div class="meta-item">
          <span class="meta-label">项目</span>
          <span class="meta-value">${quote.projectName || '—'}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">客户</span>
          <span class="meta-value">${quote.clientOrg || '—'}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">月数</span>
          <span class="meta-value">${quote.months}个月</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">折扣</span>
          <span class="meta-value discount-badge">${quote.discountRate}%</span>
        </div>
      </div>
    `
  }

  private updateItems(items: QuoteItem[]): void {
    const itemsEl = this.container.querySelector('#quoteItems')!

    if (items.length === 0) {
      itemsEl.innerHTML = `
        <div class="quote-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <p>暂无报价项目</p>
          <p class="quote-empty-hint">通过左侧对话添加服务</p>
        </div>
      `
      return
    }

    itemsEl.innerHTML = `
      <table class="quote-table">
        <thead>
          <tr>
            <th>序</th>
            <th>服务名称</th>
            <th>单价</th>
            <th>数量</th>
            <th>月数</th>
            <th>小计</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item, idx) => `
            <tr class="${item.discountable ? '' : 'no-discount'}">
              <td class="seq-cell">${idx + 1}</td>
              <td class="name-cell">
                <div class="item-name">${item.serviceName}</div>
                ${item.configDesc ? `<div class="item-config">${item.configDesc}</div>` : ''}
                ${!item.discountable ? '<span class="no-discount-tag">不折</span>' : ''}
              </td>
              <td class="price-cell">¥${formatMoney(item.unitPrice)}</td>
              <td class="qty-cell">${item.quantity}</td>
              <td class="months-cell">${item.months}</td>
              <td class="subtotal-cell">¥${formatMoney(item.subtotal)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `
  }

  private updateSummary(quote: Quote): void {
    const summaryEl = this.container.querySelector('#quoteSummary') as HTMLElement
    if (!summaryEl) return

    if (quote.items.length === 0) {
      summaryEl.style.display = 'none'
      return
    }

    summaryEl.style.display = 'block'

    const totalBefore = summaryEl.querySelector('#totalBefore')!
    const discountRateEl = summaryEl.querySelector('#discountRate')!
    const totalAfter = summaryEl.querySelector('#totalAfter')!

    totalBefore.textContent = `¥${formatMoney(quote.totalBeforeDiscount)}`
    discountRateEl.textContent = `${quote.discountRate}%`
    totalAfter.textContent = `¥${formatMoney(quote.totalAfterDiscount)}`
  }
}

function formatMoney(amount: number): string {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
