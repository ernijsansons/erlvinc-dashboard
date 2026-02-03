import { ChatInterface } from '@/components/chat/ChatInterface'

export default function ChatPage() {
  return (
    <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-white">💬 Strategic Chat</h1>
        <p className="text-[#64748b] mt-2">Ask Claude for help with decisions and operations</p>
      </div>

      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  )
}
