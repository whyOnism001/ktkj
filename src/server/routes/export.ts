import { Router, Request, Response } from 'express'
import { getSession } from '../db/index'
import { generateXlsxBuffer } from '../services/xlsx-gen'

const router = Router()

// GET /api/export/:sessionId
router.get('/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params
  const session = getSession(sessionId)

  if (!session) {
    res.status(404).json({ error: 'Session not found' })
    return
  }

  try {
    const buffer = await generateXlsxBuffer(session.quote)
    const filename = `报价单_${session.quote.projectName || session.id}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xlsx`

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`)
    res.send(buffer)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    res.status(500).json({ error: message })
  }
})

export default router
