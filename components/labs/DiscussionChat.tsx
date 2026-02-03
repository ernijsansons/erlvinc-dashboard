'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DiscussionChatProps {
  opportunityId: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export function DiscussionChat({ opportunityId }: DiscussionChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEnd = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Load existing messages from database
    loadMessages()
  }, [opportunityId])

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    const { data: opportunity } = await supabase
      .from('labs_opportunities')
      .select('discussion_messages')
      .eq('id', opportunityId)
      .single()

    const opp = opportunity as any
    if (opp?.discussion_messages) {
      setMessages(opp.discussion_messages as Message[])
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      // Send to API route
      const response = await fetch('/api/labs/discuss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          message: input,
          conversationHistory: messages,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
      }

      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)

      // Save to database
      const updateData: Record<string, any> = {
        discussion_messages: updatedMessages,
        discussion_started_at: messages.length === 0 ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString(),
      }
      // @ts-ignore - Supabase type system issue
      await supabase
        .from('labs_opportunities')
        .update(updateData)
        .eq('id', opportunityId)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-[#111827] border-[#1e293b]">
        <CardContent className="p-6">
          <div className="h-[500px] overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 && !loading && (
              <div className="flex items-center justify-center h-full">
                <p className="text-[#64748b] text-center max-w-md">
                  Start a strategic discussion about this opportunity with Claude.
                  <br />
                  <br />
                  Ask about market validation, competitive landscape, technical feasibility,
                  or any strategic considerations.
                </p>
              </div>
            )}

            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#22d3ee] text-black'
                      : 'bg-[#1e293b] text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-black/60' : 'text-[#64748b]'
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
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
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Claude about this opportunity..."
              className="flex-1 px-4 py-3 bg-[#0a0f1a] border border-[#1e293b] text-white rounded-lg focus:outline-none focus:border-[#22d3ee] placeholder:text-[#64748b]"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#22d3ee] text-black hover:bg-[#22d3ee]/80 px-6"
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
