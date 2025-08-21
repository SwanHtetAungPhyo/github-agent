"use client"
import type { Message } from "@/hooks/useChat"
interface UserMessageProps {
  message: Message
}
export default function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] md:max-w-[60%]">
        <div className="github-blue-gradient rounded-lg px-4 py-3 message-shadow">
          <p className="text-white whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div className="text-xs text-[#8b949e] mt-1 text-right">{message.timestamp.toLocaleTimeString()}</div>
      </div>
    </div>
  )
}