import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'kaitou_session_id'

export function getSessionId(): string {
  // Check URL param first
  const params = new URLSearchParams(window.location.search)
  const urlSession = params.get('session')

  if (urlSession) {
    localStorage.setItem(SESSION_KEY, urlSession)
    return urlSession
  }

  // Check localStorage
  const stored = localStorage.getItem(SESSION_KEY)
  if (stored) {
    // Sync to URL
    setUrlSession(stored)
    return stored
  }

  // Generate new
  return newSession()
}

export function newSession(): string {
  const id = uuidv4()
  localStorage.setItem(SESSION_KEY, id)
  setUrlSession(id)
  return id
}

function setUrlSession(id: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set('session', id)
  window.history.replaceState(null, '', url.toString())
}
