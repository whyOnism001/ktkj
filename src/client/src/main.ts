import { App } from './app'

const app = new App()
app.init().catch((err: unknown) => {
  console.error('Failed to initialize app:', err)
})
