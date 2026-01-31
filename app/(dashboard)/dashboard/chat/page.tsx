'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // TODO: Implement Vercel AI SDK integration with Anthropic
      // For now, just show a placeholder response
      const assistantMessage = {
        role: 'assistant' as const,
        content: 'Chat integration with Claude coming soon. Configure ANTHROPIC_API_KEY in .env.local',
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-wide">Chat</h1>
        <p className="text-[#64748b] mt-2">Strategic discussion with Claude AI</p>
      </div>

      {/* Chat Area */}
      <Card className="bg-[#111827] border-[#1e293b] flex-1 flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-[#64748b] text-center">
                Start a conversation with Claude about your business strategy and opportunities
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-[#22d3ee] text-black'
                      : 'bg-[#0a0f1a] text-white border border-[#1e293b]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#0a0f1a] text-white border border-[#1e293b] px-4 py-2 rounded-lg">
                <p className="text-sm">Claude is thinking...</p>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-[#1e293b]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Claude..."
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#0a0f1a] border border-[#1e293b] text-white rounded-lg focus:outline-none focus:border-[#22d3ee] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-[#22d3ee] text-black font-semibold rounded-lg hover:bg-[#22d3ee]/80 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
