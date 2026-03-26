import OpenAI from 'openai'
import { getSystemPrompt } from './system-prompt'
import { tools } from './tools'
import type { Quote } from '../../renderer/src/types'

interface Config {
  apiKey: string
  baseURL: string
  model: string
}

type StreamCallback = (chunk: string) => void
type ToolCallback = (name: string, args: Record<string, unknown>) => Promise<string>
type DoneCallback = (fullText: string) => void

function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
}

export class LLMClient {
  private client: OpenAI
  private model: string

  constructor(config: Config) {
    this.client = new OpenAI({
      apiKey: config.apiKey || 'no-key',
      baseURL: config.baseURL
    })
    this.model = config.model || 'deepseek-chat'
  }

  async chat(
    history: Array<{ role: string; content: string }>,
    currentQuote: Quote,
    onStream: StreamCallback,
    onToolCall: ToolCallback,
    onDone: DoneCallback
  ): Promise<void> {
    const systemPrompt = getSystemPrompt(currentQuote)

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    ]

    let fullAssistantText = ''
    const pendingMessages: OpenAI.ChatCompletionMessageParam[] = [...messages]

    // Tool calling loop
    while (true) {
      let currentText = ''
      const toolCalls: OpenAI.ChatCompletionMessageToolCall[] = []

      try {
        const stream = await this.client.chat.completions.create({
          model: this.model,
          messages: pendingMessages,
          tools: tools,
          tool_choice: 'auto',
          stream: true,
          temperature: 0.7,
          max_tokens: 4096
        })

        let currentToolCallIndex = -1
        const toolCallMap: Record<
          number,
          {
            id: string
            type: 'function'
            function: { name: string; arguments: string }
          }
        > = {}

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta

          if (!delta) continue

          // Handle text content
          if (delta.content) {
            const cleaned = stripThinkTags(delta.content)
            if (cleaned) {
              currentText += cleaned
              onStream(cleaned)
            }
          }

          // Handle tool calls streaming
          if (delta.tool_calls) {
            for (const tc of delta.tool_calls) {
              if (tc.index !== undefined) {
                currentToolCallIndex = tc.index
              }

              if (!toolCallMap[currentToolCallIndex]) {
                toolCallMap[currentToolCallIndex] = {
                  id: '',
                  type: 'function',
                  function: { name: '', arguments: '' }
                }
              }

              const entry = toolCallMap[currentToolCallIndex]
              if (tc.id) entry.id = tc.id
              if (tc.function?.name) entry.function.name += tc.function.name
              if (tc.function?.arguments) entry.function.arguments += tc.function.arguments
            }
          }
        }

        // Collect all tool calls
        for (const idx of Object.keys(toolCallMap).sort(
          (a, b) => Number(a) - Number(b)
        )) {
          toolCalls.push(toolCallMap[Number(idx)] as OpenAI.ChatCompletionMessageToolCall)
        }

        // Strip think tags from accumulated text
        currentText = stripThinkTags(currentText)
        fullAssistantText += currentText

        if (toolCalls.length === 0) {
          // No tool calls - we're done
          break
        }

        // Add assistant message with tool calls
        const assistantMsg: OpenAI.ChatCompletionMessageParam = {
          role: 'assistant',
          content: currentText || null,
          tool_calls: toolCalls
        }
        pendingMessages.push(assistantMsg)

        // Execute each tool call
        for (const tc of toolCalls) {
          let args: Record<string, unknown> = {}
          try {
            args = JSON.parse(tc.function.arguments || '{}')
          } catch {
            args = {}
          }

          const result = await onToolCall(tc.function.name, args)

          pendingMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: result
          })
        }

        // Continue the loop to get the next response
      } catch (err) {
        throw err
      }
    }

    onDone(fullAssistantText)
  }
}
