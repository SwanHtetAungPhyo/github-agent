"use client"
import type { Message } from "@/hooks/useChat"
import { AlertCircle } from "lucide-react"
interface SystemMessageProps {
  message: Message
}
export default function SystemMessage({ message }: SystemMessageProps) {
  const isError = message.content.toLowerCase().includes("error")
  return (
    <div className="flex justify-center">
      <div className="max-w-md">
        <div
          className={`rounded-lg px-4 py-3 text-center ${
            isError
              ? "bg-red-900/20 border border-red-500/20 text-red-300"
              : "bg-[#161b22] metallic-border text-[#8b949e]"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isError && <AlertCircle className="w-4 h-4" />}
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
        <div className="text-xs text-[#8b949e] mt-1 text-center">{message.timestamp.toLocaleTimeString()}</div>
      </div>
    </div>
  )
}