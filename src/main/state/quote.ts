import { randomUUID } from 'crypto'
import { calculateItemSubtotal, calculateQuoteTotals } from '../services/calculator'
import type { Quote, QuoteItem } from '../../renderer/src/types'

export class QuoteState {
  private quote: Quote

  constructor() {
    this.quote = this.createEmptyQuote()
  }

  private createEmptyQuote(): Quote {
    return {
      id: randomUUID(),
      projectName: '',
      clientOrg: '',
      providerOrg: '开投智云',
      months: 1,
      discountRate: 85,
      items: [],
      totalBeforeDiscount: 0,
      totalAfterDiscount: 0,
      createdAt: new Date().toISOString(),
      phase: 'project_info'
    }
  }

  setProjectInfo(info: Partial<Pick<Quote, 'projectName' | 'clientOrg' | 'providerOrg' | 'months' | 'discountRate'>>): void {
    if (info.projectName !== undefined) this.quote.projectName = info.projectName
    if (info.clientOrg !== undefined) this.quote.clientOrg = info.clientOrg
    if (info.providerOrg !== undefined) this.quote.providerOrg = info.providerOrg
    if (info.months !== undefined) this.quote.months = info.months
    if (info.discountRate !== undefined) this.quote.discountRate = info.discountRate
    if (this.quote.phase === 'project_info' && this.quote.projectName) {
      this.quote.phase = 'chatting'
    }
    this.recalculate()
  }

  addItem(item: Omit<QuoteItem, 'subtotal'> & { subtotal?: number }): void {
    const subtotal = calculateItemSubtotal({
      ...item,
      subtotal: item.subtotal ?? 0
    })
    this.quote.items.push({ ...item, subtotal })
    this.recalculate()
  }

  updateItem(
    index: number,
    updates: Partial<Pick<QuoteItem, 'quantity' | 'configDesc' | 'months'>>
  ): void {
    if (index < 0 || index >= this.quote.items.length) return

    const item = this.quote.items[index]
    if (updates.quantity !== undefined) item.quantity = updates.quantity
    if (updates.configDesc !== undefined) item.configDesc = updates.configDesc
    if (updates.months !== undefined) item.months = updates.months
    item.subtotal = calculateItemSubtotal(item)

    this.recalculate()
  }

  removeItem(index: number): void {
    if (index < 0 || index >= this.quote.items.length) return
    this.quote.items.splice(index, 1)
    this.recalculate()
  }

  private recalculate(): void {
    const totals = calculateQuoteTotals(this.quote.items, this.quote.discountRate)
    this.quote.totalBeforeDiscount = totals.totalBeforeDiscount
    this.quote.totalAfterDiscount = totals.totalAfterDiscount
  }

  getQuote(): Quote {
    return { ...this.quote, items: [...this.quote.items] }
  }

  reset(): void {
    this.quote = this.createEmptyQuote()
  }
}
