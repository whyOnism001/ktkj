import type { QuoteItem, Quote } from '../types'

export function calculateItemSubtotal(item: QuoteItem): number {
  return item.unitPrice * item.quantity * item.months
}

export function calculateQuoteTotals(
  items: QuoteItem[],
  discountRate: number
): {
  totalBeforeDiscount: number
  totalAfterDiscount: number
  discountableTotal: number
  nonDiscountableTotal: number
} {
  let discountableTotal = 0
  let nonDiscountableTotal = 0

  for (const item of items) {
    const subtotal = calculateItemSubtotal(item)
    if (item.discountable) {
      discountableTotal += subtotal
    } else {
      nonDiscountableTotal += subtotal
    }
  }

  const totalBeforeDiscount = discountableTotal + nonDiscountableTotal
  const discountMultiplier = discountRate / 100
  const totalAfterDiscount = discountableTotal * discountMultiplier + nonDiscountableTotal

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    discountableTotal,
    nonDiscountableTotal
  }
}

export function recalculateQuote(quote: Quote): Quote {
  const updatedItems = quote.items.map((item) => ({
    ...item,
    subtotal: calculateItemSubtotal(item)
  }))

  const totals = calculateQuoteTotals(updatedItems, quote.discountRate)

  return {
    ...quote,
    items: updatedItems,
    ...totals
  }
}
