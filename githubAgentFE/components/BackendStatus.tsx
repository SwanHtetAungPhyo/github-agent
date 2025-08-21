"use client"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
interface BackendStatusProps {
  connected: boolean | null
  loading: boolean
  onRetry: () => void
}
export default function BackendStatus({ connected, loading, onRetry }: BackendStatusProps) {
  if (connected === null || connected === true) return null
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-red-900/90 border border-red-500/20 rounded-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-300 mb-1">Backend Disconnected</h3>
            <p className="text-sm text-red-200 mb-3">
              Cannot connect to the backend server. Please ensure it's running.
            </p>
            <button
              onClick={onRetry}
              disabled={loading}
              className="text-xs bg-red-800 hover:bg-red-700 disabled:opacity-50 
                       text-red-100 px-3 py-1 rounded transition-colors
                       flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
              {loading ? "Checking..." : "Retry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}