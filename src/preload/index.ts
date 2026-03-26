import { contextBridge, ipcRenderer } from 'electron'
import type { Quote } from '../renderer/src/types'

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('api', {
  chat: {
    send: (message: string): Promise<void> => ipcRenderer.invoke('chat:send', message),
    onStream: (cb: (chunk: string) => void) => {
      ipcRenderer.on('chat:stream', (_event, chunk) => cb(chunk))
    },
    onDone: (cb: (fullText: string) => void) => {
      ipcRenderer.on('chat:done', (_event, fullText) => cb(fullText))
    },
    onError: (cb: (error: string) => void) => {
      ipcRenderer.on('chat:error', (_event, error) => cb(error))
    },
    onToolCall: (cb: (data: { name: string; args: unknown; result: string }) => void) => {
      ipcRenderer.on('chat:tool-call', (_event, data) => cb(data))
    },
    clear: (): Promise<boolean> => ipcRenderer.invoke('chat:clear'),
    removeAllListeners: () => {
      ipcRenderer.removeAllListeners('chat:stream')
      ipcRenderer.removeAllListeners('chat:done')
      ipcRenderer.removeAllListeners('chat:error')
      ipcRenderer.removeAllListeners('chat:tool-call')
    }
  },
  quote: {
    get: (): Promise<Quote> => ipcRenderer.invoke('quote:get'),
    setProjectInfo: (info: Partial<Quote>): Promise<Quote> =>
      ipcRenderer.invoke('quote:set-project-info', info),
    export: (): Promise<{ success: boolean; filePath?: string; error?: string; canceled?: boolean }> =>
      ipcRenderer.invoke('quote:export'),
    onUpdated: (cb: (quote: Quote) => void) => {
      ipcRenderer.on('quote:updated', (_event, quote) => cb(quote))
    },
    removeListener: () => {
      ipcRenderer.removeAllListeners('quote:updated')
    }
  },
  history: {
    list: (): Promise<unknown[]> => ipcRenderer.invoke('history:list'),
    get: (id: string): Promise<Quote | undefined> => ipcRenderer.invoke('history:get', id)
  },
  config: {
    get: (): Promise<unknown> => ipcRenderer.invoke('config:get'),
    set: (cfg: unknown): Promise<unknown> => ipcRenderer.invoke('config:set', cfg)
  }
})
