import Database from 'better-sqlite3'
import { join } from 'path'
import type { Quote } from '../types'

const DB_PATH = join(process.cwd(), 'data', 'quoter.db')

let db: Database.Database

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        messages TEXT NOT NULL,
        quote TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)
  }
  return db
}

export interface StoredMessage {
  id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
  toolName?: string
  toolArgs?: unknown
  toolResult?: string
  timestamp: number
}

export interface Session {
  id: string
  messages: StoredMessage[]
  quote: Quote
  createdAt: number
  updatedAt: number
}

export function createDefaultQuote(sessionId: string): Quote {
  return {
    id: sessionId,
    projectName: '',
    clientOrg: '',
    providerOrg: '开投智云',
    months: 12,
    discountRate: 85,
    items: [],
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    createdAt: new Date().toISOString(),
    phase: 'project_info'
  }
}

export function getSession(id: string): Session | null {
  const database = getDb()
  const row = database.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as
    | { id: string; messages: string; quote: string; created_at: number; updated_at: number }
    | undefined

  if (!row) return null

  return {
    id: row.id,
    messages: JSON.parse(row.messages) as StoredMessage[],
    quote: JSON.parse(row.quote) as Quote,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function saveSession(id: string, messages: StoredMessage[], quote: Quote): void {
  const database = getDb()
  const now = Date.now()
  const existing = database.prepare('SELECT id FROM sessions WHERE id = ?').get(id)

  if (existing) {
    database
      .prepare('UPDATE sessions SET messages = ?, quote = ?, updated_at = ? WHERE id = ?')
      .run(JSON.stringify(messages), JSON.stringify(quote), now, id)
  } else {
    database
      .prepare(
        'INSERT INTO sessions (id, messages, quote, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
      )
      .run(id, JSON.stringify(messages), JSON.stringify(quote), now, now)
  }
}

export function listSessions(): Array<{
  id: string
  projectName: string
  clientOrg: string
  createdAt: string
  totalAfterDiscount: number
}> {
  const database = getDb()
  const rows = database
    .prepare('SELECT id, quote, created_at FROM sessions ORDER BY updated_at DESC')
    .all() as Array<{ id: string; quote: string; created_at: number }>

  return rows.map((row) => {
    const quote = JSON.parse(row.quote) as Quote
    return {
      id: row.id,
      projectName: quote.projectName,
      clientOrg: quote.clientOrg,
      createdAt: quote.createdAt,
      totalAfterDiscount: quote.totalAfterDiscount
    }
  })
}

export function deleteSession(id: string): void {
  const database = getDb()
  database.prepare('DELETE FROM sessions WHERE id = ?').run(id)
}
