import { app, BrowserWindow } from 'electron'
import { readFileSync } from 'fs'
import { join } from 'path'

interface AppConfig {
  serverURL?: string
  port?: number
}

function loadConfig(): AppConfig {
  try {
    const raw = readFileSync(join(process.cwd(), 'config.json'), 'utf-8')
    return JSON.parse(raw) as AppConfig
  } catch {
    return {}
  }
}

function createWindow(): void {
  const config = loadConfig()
  const serverURL = config.serverURL || `http://localhost:${config.port || 3000}`

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: '开投智云 AI 报价助手',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  void win.loadURL(serverURL)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
