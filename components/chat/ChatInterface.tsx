'use client'

import { useRef, useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatInterface() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const messagesEnd = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    // Create abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      }

      setMessages(prev => [...prev, assistantMessage])

      // Read the stream using AI SDK utilities
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let done = false
      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone

        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('0:')) {
              // Text chunk
              const text = line.slice(3, -1) // Remove '0:"' and '"'
              setMessages(prev => {
                const newMessages = [...prev]
                const lastMessage = newMessages[newMessages.length - 1]
                if (lastMessage.role === 'assistant') {
                  lastMessage.content += text
                }
                return newMessages
              })
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, do nothing
        return
      }
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      console.error('[Chat UI] Error:', error)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Messages */}
      <Card className="bg-[#111827] border-[#1e293b] flex-1 flex flex-col min-h-[500px]">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <p className="text-[#64748b] text-lg mb-4">
                  Hi! I'm Claude, your strategic advisor. Ask me anything about:
                </p>
                <ul className="mt-2 text-[#64748b] text-sm space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-[#22d3ee]">•</span>
                    <span>Task and project management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22d3ee]">•</span>
                    <span>Agent assignments and coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22d3ee]">•</span>
                    <span>LABS opportunity evaluation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22d3ee]">•</span>
                    <span>Strategic business decisions</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-[#22d3ee] text-black'
                    : 'bg-[#1e293b] text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1e293b] text-white px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22d3ee] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#22d3ee] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#22d3ee] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg max-w-md">
                <p className="text-sm font-semibold mb-1">Error</p>
                <p className="text-xs">{error.message}</p>
              </div>
            </div>
          )}

          <div ref={messagesEnd} />
        </CardContent>
      </Card>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about ERLV Inc operations..."
          className="flex-1 px-4 py-3 bg-[#111827] border border-[#1e293b] text-white rounded-lg focus:outline-none focus:border-[#22d3ee] placeholder:text-[#64748b]"
          disabled={isLoading}
        />
        {isLoading ? (
          <Button
            type="button"
            onClick={stop}
            className="bg-red-500 text-white hover:bg-red-600 px-6"
          >
            Stop
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!input.trim()}
            className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/80 px-6"
          >
            Send
          </Button>
        )}
      </form>
    </div>
  )
}
