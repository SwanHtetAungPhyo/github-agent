"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { api, type ChatResponse } from "@/lib/api"
export interface Message {
  id: string
  type: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  toolResults?: Array<{
    toolName: string
    result: any
  }>
}
const DEMO_RESPONSES = [
  "I'm a demo assistant! In the real version, I would help you research GitHub repositories, analyze code, and answer development questions. This is just a preview of the interface.",
  "This is a simulated response to demonstrate the chat interface. The real assistant would connect to GitHub's API and provide actual research capabilities.",
  "In demo mode, I can show you how the interface works, but I can't access real GitHub data. Set up the backend server to unlock the full functionality!",
  "The real GitHub Research Assistant would help you explore repositories, understand codebases, find contributors, analyze trends, and much more. This is just a UI preview.",
  "Demo mode active! The actual assistant would use GitHub's API to provide real-time repository information, code analysis, and development insights.",
]
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [threadId, setThreadId] = useState<string | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])
  useEffect(() => {
    const demoMode = localStorage.getItem("demo_mode")
    if (demoMode === "true") {
      const savedMessages = localStorage.getItem("demo_messages")
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages)
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        )
      } else {
        const welcomeMessage: Message = {
          id: "welcome",
          type: "system",
          content:
            "🎭 Demo Mode Active - This is a preview of the GitHub Research Assistant interface. Real functionality requires backend setup.",
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      }
    }
  }, [])
  useEffect(() => {
    const demoMode = localStorage.getItem("demo_mode")
    if (demoMode === "true" && messages.length > 0) {
      localStorage.setItem("demo_messages", JSON.stringify(messages))
    }
  }, [messages])
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: content.trim(),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)
      try {
        const demoMode = localStorage.getItem("demo_mode")
        if (demoMode === "true") {
          await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))
          const randomResponse = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)]
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: randomResponse,
            timestamp: new Date(),
            toolResults: [
              { toolName: "GitHub API", result: "Demo data" },
              { toolName: "Code Analysis", result: "Simulated" },
            ],
          }
          setMessages((prev) => [...prev, assistantMessage])
        } else {
          const response: ChatResponse = await api.chat(content.trim(), threadId)
          if (response.success) {
            setThreadId(response.threadId)
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: response.message,
              timestamp: new Date(),
              toolResults: response.toolResults,
            }
            setMessages((prev) => [...prev, assistantMessage])
          } else {
            throw new Error("Chat request failed")
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to send message"
        setError(errorMessage)
        const systemMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "system",
          content: `Error: ${errorMessage}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, systemMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [threadId, isLoading],
  )
  const clearChat = useCallback(() => {
    setMessages([])
    setThreadId(undefined)
    setError(null)
    const demoMode = localStorage.getItem("demo_mode")
    if (demoMode === "true") {
      localStorage.removeItem("demo_messages")
      const welcomeMessage: Message = {
        id: "welcome",
        type: "system",
        content:
          "🎭 Demo Mode Active - This is a preview of the GitHub Research Assistant interface. Real functionality requires backend setup.",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [])
  const exportChat = useCallback(() => {
    const markdown = messages
      .map((msg) => {
        const timestamp = msg.timestamp.toLocaleString()
        const sender = msg.type === "user" ? "You" : msg.type === "assistant" ? "Assistant" : "System"
        return `**${sender}** (${timestamp})\n${msg.content}\n`
      })
      .join("\n---\n\n")
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `github-research-chat-${new Date().toISOString().split("T")[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [messages])
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    exportChat,
    messagesEndRef,
  }
}