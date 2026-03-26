import Store from 'electron-store'
import type { Quote } from '../../renderer/src/types'

interface StoreSchema {
  quotes: Quote[]
}

export class HistoryStore {
  private store: Store<StoreSchema>

  constructor() {
    this.store = new Store<StoreSchema>({
      name: 'kaitou-quoter-history',
      defaults: {
        quotes: []
      }
    })
  }

  saveQuote(quote: Quote): void {
    const quotes = this.store.get('quotes', [])
    // Limit to 50 history items
    const existing = quotes.findIndex((q) => q.id === quote.id)
    if (existing >= 0) {
      quotes[existing] = quote
    } else {
      quotes.unshift(quote)
      if (quotes.length > 50) quotes.pop()
    }
    this.store.set('quotes', quotes)
  }

  listQuotes(): Pick<Quote, 'id' | 'projectName' | 'clientOrg' | 'createdAt' | 'totalAfterDiscount'>[] {
    const quotes = this.store.get('quotes', [])
    return quotes.map((q) => ({
      id: q.id,
      projectName: q.projectName,
      clientOrg: q.clientOrg,
      createdAt: q.createdAt,
      totalAfterDiscount: q.totalAfterDiscount
    }))
  }

  getQuote(id: string): Quote | undefined {
    const quotes = this.store.get('quotes', [])
    return quotes.find((q) => q.id === id)
  }

  deleteQuote(id: string): void {
    const quotes = this.store.get('quotes', [])
    this.store.set(
      'quotes',
      quotes.filter((q) => q.id !== id)
    )
  }
}
