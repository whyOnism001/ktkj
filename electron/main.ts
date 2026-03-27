import { app, BrowserWindow } from 'electron'
import { fork, ChildProcess } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import * as http from 'http'

interface AppConfig {
  serverURL?: string
  port?: number
}

function loadConfig(): AppConfig {
  try {
    const raw = readFileSync(join(app.getAppPath(), 'config.json'), 'utf-8')
    return JSON.parse(raw) as AppConfig
  } catch {
    return {}
  }
}

function waitForServer(port: number, maxMs = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const check = () => {
      const req = http.get(`http://localhost:${port}/api/health`, (res) => {
        if (res.statusCode === 200) {
          resolve()
        } else {
          retry()
        }
        res.resume()
      })
      req.on('error', retry)
      req.setTimeout(500, () => { req.destroy(); retry() })
    }
    const retry = () => {
      if (Date.now() - start > maxMs) {
        reject(new Error('Server did not start in time'))
      } else {
        setTimeout(check, 300)
      }
    }
    check()
  })
}

let serverProcess: ChildProcess | null = null

async function startEmbeddedServer(port: number): Promise<void> {
  // In packaged app, server is at resources/dist/server/index.js
  // In dev (electron . from project root), server not started here
  const serverPath = existsSync(join(process.resourcesPath, 'dist/server/index.js'))
    ? join(process.resourcesPath, 'dist/server/index.js')
    : join(app.getAppPath(), 'dist/server/index.js')

  if (!existsSync(serverPath)) {
    throw new Error(`Server not found at ${serverPath}. Run npm run build first.`)
  }

  serverProcess = fork(serverPath, [], {
    env: { ...process.env, PORT: String(port) },
    cwd: app.getAppPath(),
    silent: false
  })

  serverProcess.on('error', (err) => {
    console.error('Server process error:', err)
  })

  await waitForServer(port)
}

async function createWindow(): Promise<void> {
  const config = loadConfig()
  const port = config.port || 3000
  const isDev = process.env.NODE_ENV === 'development'

  if (!isDev) {
    await startEmbeddedServer(port)
  }

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    title: '开投智云 AI 报价助手',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  void win.loadURL(`http://localhost:${port}`)
}

app.whenReady().then(() => {
  createWindow().catch(console.error)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow().catch(console.error)
    }
  })
})

app.on('before-quit', () => {
  serverProcess?.kill()
})

app.on('window-all-closed', () => {
  serverProcess?.kill()
  if (process.platform !== 'darwin') app.quit()
})
