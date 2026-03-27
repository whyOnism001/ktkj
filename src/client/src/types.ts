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

export interface SSEEvent {
  type: 'text' | 'tool_call' | 'tool_result' | 'quote_updated' | 'done' | 'error'
  content?: string
  name?: string
  args?: unknown
  result?: unknown
  quote?: Quote
  message?: string
}
