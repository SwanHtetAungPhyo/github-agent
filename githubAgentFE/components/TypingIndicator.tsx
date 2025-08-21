"use client"
import { Bot, Sparkles } from "lucide-react"

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] md:max-w-[60%]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2188ff]/20 to-[#1f6feb]/20 
                        border border-[#2188ff]/30 flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="w-5 h-5 text-[#2188ff]" />
          </div>
          <div className="bg-[#21262d] border border-[#30363d] rounded-xl px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#2188ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#2188ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#2188ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <div className="flex items-center gap-1 text-[#8b949e] text-sm">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}