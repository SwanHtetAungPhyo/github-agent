"use client"
import type { Message } from "@/hooks/useChat"
import { Bot } from "lucide-react"
interface AssistantMessageProps {
  message: Message
}
export default function AssistantMessage({ message }: AssistantMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] md:max-w-[60%]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#21262d] metallic-border flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="w-4 h-4 text-[#2188ff]" />
          </div>
          <div className="flex-1">
            <div className="bg-[#21262d] metallic-border rounded-lg px-4 py-3 message-shadow">
              <p className="text-[#f0f6fc] whitespace-pre-wrap break-words">{message.content}</p>
              {message.toolResults && message.toolResults.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#30363d]">
                  <p className="text-xs text-[#8b949e] mb-2">Tools used:</p>
                  <div className="flex flex-wrap gap-1">
                    {message.toolResults.map((tool, index) => (
                      <span key={index} className="text-xs bg-[#161b22] text-[#2188ff] px-2 py-1 rounded">
                        {tool.toolName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs text-[#8b949e] mt-1">{message.timestamp.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}