"use client"
import type React from "react"
import type { Message } from "@/hooks/useChat"
import UserMessage from "./UserMessage"
import AssistantMessage from "./AssistantMessage"
import SystemMessage from "./SystemMessage"
import TypingIndicator from "./TypingIndicator"
import ErrorMessage from "./ErrorMessage"
import EmptyState from "./EmptyState"

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  backendConnected?: boolean | null
}
export default function MessageList({ messages, isLoading, messagesEndRef, backendConnected }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 && (
          <EmptyState backendConnected={backendConnected} />
        )}
        {messages.map((message) => {
          switch (message.type) {
            case "user":
              return <UserMessage key={message.id} message={message} />
            case "assistant":
              return <AssistantMessage key={message.id} message={message} />
            case "system":
              // Check if it's an error message and render ErrorMessage component
              if (message.content.toLowerCase().includes("error:")) {
                const errorContent = message.content.replace("Error: ", "")
                return (
                  <ErrorMessage 
                    key={message.id} 
                    error={errorContent}
                    className="mb-6"
                  />
                )
              }
              return <SystemMessage key={message.id} message={message} />
            default:
              return null
          }
        })}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}