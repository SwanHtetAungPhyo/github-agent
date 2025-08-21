"use client"
import { useChat } from "@/hooks/useChat"
import { useAuth } from "@/hooks/useAuth"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import ChatInput from "./ChatInput"
import BackendStatus from "./BackendStatus"
import StatusIndicator from "./StatusIndicator"
export default function ChatLayout() {
  const { messages, isLoading, sendMessage, clearChat, exportChat, messagesEndRef } = useChat()
  const { backendConnected, loading: authLoading, checkAuth } = useAuth()
  return (
    <div className="h-screen flex flex-col bg-[#0d1117]">
      <StatusIndicator backendConnected={backendConnected} isLoading={authLoading} />
      <BackendStatus connected={backendConnected} loading={authLoading} onRetry={checkAuth} />
      <ChatHeader onClearChat={clearChat} onExportChat={exportChat} />
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        messagesEndRef={messagesEndRef} 
        backendConnected={backendConnected}
      />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  )
}