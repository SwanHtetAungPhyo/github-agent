"use client"
import { LogOut, Trash2, Download, User, Play } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"
interface ChatHeaderProps {
  onClearChat: () => void
  onExportChat: () => void
}
export default function ChatHeader({ onClearChat, onExportChat }: ChatHeaderProps) {
  const { user, logout } = useAuth()
  const handleLogout = async () => {
    const demoMode = localStorage.getItem("demo_mode")
    const message = demoMode === "true" ? "Exit demo mode?" : "Are you sure you want to logout?"
    if (confirm(message)) {
      await logout()
    }
  }
  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      onClearChat()
    }
  }
  const isDemoMode = localStorage.getItem("demo_mode") === "true"
  return (
    <header className="metallic-gradient metallic-border border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isDemoMode && (
            <div className="flex items-center gap-2 bg-yellow-900/20 border border-yellow-500/20 rounded-lg px-3 py-1">
              <Play className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-300 font-medium">Demo Mode</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <Image
                src={user.avatar_url || "/placeholder.svg"}
                alt={user.login}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-[#2188ff]/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#21262d] flex items-center justify-center">
                <User className="w-5 h-5 text-[#8b949e]" />
              </div>
            )}
            <div>
              <h1 className="font-semibold text-[#f0f6fc]">{user?.name || user?.login || "User"}</h1>
              <p className="text-sm text-[#8b949e]">{isDemoMode ? "Demo Research Assistant" : "Research Assistant"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExportChat}
            className="p-2 rounded-lg hover:bg-[#21262d] transition-colors text-[#8b949e] hover:text-[#f0f6fc]"
            title="Export Chat"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-lg hover:bg-[#21262d] transition-colors text-[#8b949e] hover:text-[#f0f6fc]"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-[#21262d] transition-colors text-[#8b949e] hover:text-[#f0f6fc]"
            title={isDemoMode ? "Exit Demo" : "Logout"}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}