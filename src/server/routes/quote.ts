import { Router, Request, Response } from 'express'
import { getSession, saveSession, createDefaultQuote, deleteSession } from '../db/index'
import { calculateQuoteTotals } from '../services/calculator'
import type { Quote } from '../types'

const router = Router()

// GET /api/quote/:sessionId
router.get('/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params
  let session = getSession(sessionId)

  if (!session) {
    const defaultQuote = createDefaultQuote(sessionId)
    session = {
      id: sessionId,
      messages: [],
      quote: defaultQuote,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    saveSession(sessionId, [], defaultQuote)
  }

  res.json({ quote: session.quote, messages: session.messages })
})

// PATCH /api/quote/:sessionId
router.patch('/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params
  let session = getSession(sessionId)

  if (!session) {
    const defaultQuote = createDefaultQuote(sessionId)
    session = {
      id: sessionId,
      messages: [],
      quote: defaultQuote,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  }

  const updates = req.body as Partial<Quote>
  const quote = session.quote

  if (updates.projectName !== undefined) quote.projectName = updates.projectName
  if (updates.clientOrg !== undefined) quote.clientOrg = updates.clientOrg
  if (updates.providerOrg !== undefined) quote.providerOrg = updates.providerOrg
  if (updates.months !== undefined) quote.months = updates.months
  if (updates.discountRate !== undefined) quote.discountRate = updates.discountRate

  // Advance phase if project info filled
  if (quote.phase === 'project_info' && quote.projectName) {
    quote.phase = 'chatting'
  }

  // Recalculate totals with updated discount rate
  const totals = calculateQuoteTotals(quote.items, quote.discountRate)
  quote.totalBeforeDiscount = totals.totalBeforeDiscount
  quote.totalAfterDiscount = totals.totalAfterDiscount

  saveSession(sessionId, session.messages, quote)
  res.json(quote)
})

// DELETE /api/quote/:sessionId
router.delete('/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params
  deleteSession(sessionId)
  res.json({ success: true })
})

export default router
