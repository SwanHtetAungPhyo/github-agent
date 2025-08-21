"use client"
import { CheckCircle, AlertCircle, Clock, Wifi, WifiOff } from "lucide-react"
import { useState, useEffect } from "react"

interface StatusIndicatorProps {
  backendConnected: boolean | null
  isLoading?: boolean
  className?: string
}

export default function StatusIndicator({ backendConnected, isLoading = false, className = "" }: StatusIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show status indicator when there's a change in connection status
    if (backendConnected !== null) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [backendConnected])

  if (!isVisible && !isLoading) return null

  const getStatusInfo = () => {
    if (isLoading) {
      return {
        icon: <Clock className="w-4 h-4 animate-spin" />,
        text: "Connecting...",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/30"
      }
    }

    if (backendConnected === true) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Connected",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/30"
      }
    }

    if (backendConnected === false) {
      return {
        icon: <WifiOff className="w-4 h-4" />,
        text: "Backend Offline",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/30"
      }
    }

    return {
      icon: <AlertCircle className="w-4 h-4" />,
      text: "Unknown Status",
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
      borderColor: "border-gray-500/30"
    }
  }

  const status = getStatusInfo()

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    } ${className}`}>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm
                      ${status.bgColor} ${status.borderColor} ${status.color}`}>
        {status.icon}
        <span className="text-sm font-medium">{status.text}</span>
      </div>
    </div>
  )
}
