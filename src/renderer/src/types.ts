export interface CatalogItem {
  code: string
  name: string
  category: string
  specs: string
  unit: string
  unitPrice: number
  discountable: boolean
  aliases: string[]
}

export interface QuoteItem {
  serviceCode: string
  serviceName: string
  specs: string
  configDesc?: string
  quantity: number
  unitPrice: number
  months: number
  discountable: boolean
  subtotal: number
}

export type QuotePhase = 'project_info' | 'chatting' | 'preview' | 'exported'

export interface Quote {
  id: string
  projectName: string
  clientOrg: string
  providerOrg: string
  months: number
  discountRate: number
  items: QuoteItem[]
  totalBeforeDiscount: number
  totalAfterDiscount: number
  createdAt: string
  phase: QuotePhase
}

export interface AppConfig {
  provider: string
  apiKey: string
  baseURL: string
  model: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
  toolName?: string
  toolArgs?: unknown
  toolResult?: string
  streaming?: boolean
  timestamp: number
}

export interface WindowApi {
  chat: {
    send: (message: string) => Promise<void>
    onStream: (cb: (chunk: string) => void) => void
    onDone: (cb: (fullText: string) => void) => void
    onError: (cb: (error: string) => void) => void
    onToolCall: (cb: (data: { name: string; args: unknown; result: string }) => void) => void
    clear: () => Promise<boolean>
    removeAllListeners: () => void
  }
  quote: {
    get: () => Promise<Quote>
    setProjectInfo: (info: Partial<Quote>) => Promise<Quote>
    export: () => Promise<{ success: boolean; filePath?: string; error?: string; canceled?: boolean }>
    onUpdated: (cb: (quote: Quote) => void) => void
    removeListener: () => void
  }
  history: {
    list: () => Promise<Array<Pick<Quote, 'id' | 'projectName' | 'clientOrg' | 'createdAt' | 'totalAfterDiscount'>>>
    get: (id: string) => Promise<Quote | undefined>
  }
  config: {
    get: () => Promise<AppConfig>
    set: (cfg: Partial<AppConfig>) => Promise<AppConfig>
  }
}

declare global {
  interface Window {
    api: WindowApi
  }
}
