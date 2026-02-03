'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })
  const messagesEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

          {messages.map((message, i) => (
            <div
              key={i}
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

          <div ref={messagesEnd} />
        </CardContent>
      </Card>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me anything about ERLV Inc operations..."
          className="flex-1 px-4 py-3 bg-[#111827] border border-[#1e293b] text-white rounded-lg focus:outline-none focus:border-[#22d3ee] placeholder:text-[#64748b]"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/80 px-6"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  )
}
