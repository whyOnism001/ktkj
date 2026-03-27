import express from 'express'
import cors from 'cors'
import { join } from 'path'
import { existsSync } from 'fs'
import { readFileSync } from 'fs'
import chatRouter from './routes/chat'
import quoteRouter from './routes/quote'
import exportRouter from './routes/export'

interface AppConfig {
  port?: number
  [key: string]: unknown
}

function loadConfig(): AppConfig {
  try {
    const raw = readFileSync(join(process.cwd(), 'config.json'), 'utf-8')
    return JSON.parse(raw) as AppConfig
  } catch {
    return {}
  }
}

const config = loadConfig()
const PORT = config.port || 3000

const app = express()

// CORS for development
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
  })
)

app.use(express.json())

// API routes
app.use('/api/chat', chatRouter)
app.use('/api/quote', quoteRouter)
app.use('/api/export', exportRouter)

// Serve static files in production
const staticDir = join(process.cwd(), 'dist', 'client')
if (existsSync(staticDir)) {
  app.use(express.static(staticDir))
  // SPA fallback
  app.get('*', (_req, res) => {
    res.sendFile(join(staticDir, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`开投智云报价服务器启动: http://localhost:${PORT}`)
})

export default app
