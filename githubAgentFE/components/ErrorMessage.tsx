"use client"
import { AlertCircle, RefreshCw, Clock, Zap, ExternalLink } from "lucide-react"
import { useState } from "react"

interface ErrorMessageProps {
  error: string
  onRetry?: () => void
  className?: string
}

export default function ErrorMessage({ error, onRetry, className = "" }: ErrorMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isRateLimitError = error.toLowerCase().includes("rate limit") || 
                          error.toLowerCase().includes("tokens per day") ||
                          error.toLowerCase().includes("limit reached")

  const isNetworkError = error.toLowerCase().includes("network") || 
                        error.toLowerCase().includes("connection") ||
                        error.toLowerCase().includes("fetch")

  const isAuthError = error.toLowerCase().includes("authentication") || 
                     error.toLowerCase().includes("unauthorized") ||
                     error.toLowerCase().includes("401")

  const getErrorIcon = () => {
    if (isRateLimitError) return <Clock className="w-5 h-5" />
    if (isNetworkError) return <Zap className="w-5 h-5" />
    if (isAuthError) return <AlertCircle className="w-5 h-5" />
    return <AlertCircle className="w-5 h-5" />
  }

  const getErrorTitle = () => {
    if (isRateLimitError) return "AI Service Temporarily Unavailable"
    if (isNetworkError) return "Connection Error"
    if (isAuthError) return "Authentication Required"
    return "Something went wrong"
  }

  const getErrorDescription = () => {
    if (isRateLimitError) {
      return "The AI service has reached its daily limit. Please try again later or upgrade your plan."
    }
    if (isNetworkError) {
      return "Unable to connect to the server. Please check your internet connection and try again."
    }
    if (isAuthError) {
      return "Please authenticate with GitHub to continue using the assistant."
    }
    return "An unexpected error occurred. Please try again."
  }

  const getActionButton = () => {
    if (isRateLimitError) {
      return (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2188ff] hover:bg-[#1f6feb] 
                     text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again Later
          </button>
          <a
            href="https://console.groq.com/settings/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] 
                     text-[#f0f6fc] rounded-lg transition-colors duration-200 text-sm font-medium border border-[#30363d]"
          >
            <ExternalLink className="w-4 h-4" />
            Upgrade Plan
          </a>
        </div>
      )
    }
    
    if (isNetworkError || isAuthError) {
      return (
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2188ff] hover:bg-[#1f6feb] 
                   text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )
    }

    return (
      <button
        onClick={onRetry}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2188ff] hover:bg-[#1f6feb] 
                 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 
                    rounded-xl p-6 backdrop-blur-sm ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 bg-red-500/20 rounded-lg">
          {getErrorIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-[#f0f6fc]">
              {getErrorTitle()}
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#8b949e] hover:text-[#f0f6fc] transition-colors duration-200"
            >
              {isExpanded ? "−" : "+"}
            </button>
          </div>
          
          <p className="text-[#8b949e] mb-4 leading-relaxed">
            {getErrorDescription()}
          </p>

          {isExpanded && (
            <div className="mb-4 p-3 bg-[#161b22] rounded-lg border border-[#30363d]">
              <p className="text-xs text-[#8b949e] font-mono break-all">
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {getActionButton()}
          </div>

          {isRateLimitError && (
            <div className="mt-4 p-3 bg-[#161b22] rounded-lg border border-[#30363d]">
              <div className="flex items-center gap-2 text-sm text-[#8b949e] mb-2">
                <Clock className="w-4 h-4" />
                <span>Rate Limit Info</span>
              </div>
              <div className="text-xs text-[#8b949e] space-y-1">
                <p>• Daily token limit reached</p>
                <p>• Limit resets in ~20 minutes</p>
                <p>• Consider upgrading for higher limits</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
