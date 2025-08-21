"use client"
import { useAuth } from "@/hooks/useAuth"
import LoginPage from "./LoginPage"
import ChatLayout from "./ChatLayout"
import { Loader2 } from "lucide-react"
export default function AuthGuard() {
  const { authenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center metallic-gradient">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#2188ff]" />
          <p className="text-[#8b949e]">Checking authentication...</p>
        </div>
      </div>
    )
  }
  return authenticated ? <ChatLayout /> : <LoginPage />
}