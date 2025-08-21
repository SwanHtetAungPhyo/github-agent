"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}
export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [message])
  return (
    <div className="border-t metallic-border bg-[#0d1117] px-6 py-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about GitHub repositories, code, or development..."
              className="w-full bg-[#21262d] border border-[#30363d] rounded-xl px-4 py-3 pr-16 
                       text-[#f0f6fc] placeholder-[#8b949e] resize-none min-h-[48px] max-h-[120px]
                       focus:outline-none focus:ring-2 focus:ring-[#2188ff]/50 focus:border-[#2188ff]/50 
                       transition-all duration-200 backdrop-blur-sm"
              rows={1}
              disabled={isLoading}
            />
            <div className={`absolute bottom-2 right-2 text-xs transition-colors duration-200 ${
              message.length > 1800 ? "text-yellow-500" : "text-[#8b949e]"
            }`}>
              {message.length}/2000
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center
                     ${!message.trim() || isLoading 
                       ? "bg-[#21262d] text-[#8b949e] cursor-not-allowed" 
                       : "bg-gradient-to-r from-[#2188ff] to-[#1f6feb] hover:from-[#1f6feb] hover:to-[#2188ff] text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                     }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-[#8b949e]">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className={message.length > 1800 ? "text-yellow-500" : ""}>
            {message.length > 2000 ? "Message too long" : ""}
          </span>
        </div>
      </form>
    </div>
  )
}