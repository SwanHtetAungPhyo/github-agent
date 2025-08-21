"use client"
import { Github, Loader2, AlertCircle, RefreshCw, Play } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
export default function LoginPage() {
  const { login, loading, error, backendConnected, checkAuth } = useAuth()
  const startDemoMode = () => {
    localStorage.setItem("demo_mode", "true")
    localStorage.setItem(
      "demo_user",
      JSON.stringify({
        id: 12345,
        login: "demo-user",
        name: "Demo User",
        email: "demo@example.com",
        avatar_url: "/github-user-avatar.png",
      }),
    )
    window.location.reload()
  }
  if (backendConnected === false) {
    return (
      <div className="min-h-screen flex items-center justify-center metallic-gradient">
        <div className="max-w-lg w-full mx-4">
          <div className="glass-effect metallic-border rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-2xl font-bold mb-4 text-[#f0f6fc]">Backend Setup Required</h1>
            <div className="text-left bg-[#161b22] rounded-lg p-4 mb-6">
              <p className="text-sm text-[#f0f6fc] mb-3 font-semibold">
                This is a frontend-only demo. To use with real GitHub data:
              </p>
              <ol className="text-sm text-[#8b949e] space-y-2 list-decimal list-inside">
                <li>
                  Set up a backend server with GitHub OAuth on{" "}
                  <code className="bg-[#21262d] px-1 rounded text-[#2188ff]">http://localhost:3000</code>
                </li>
                <li>
                  Implement the required endpoints:{" "}
                  <code className="bg-[#21262d] px-1 rounded text-[#2188ff]">/auth/github</code>,{" "}
                  <code className="bg-[#21262d] px-1 rounded text-[#2188ff]">/auth/status</code>,{" "}
                  <code className="bg-[#21262d] px-1 rounded text-[#2188ff]">/chat</code>
                </li>
                <li>Configure CORS to allow requests from this domain</li>
                <li>
                  Or set <code className="bg-[#21262d] px-1 rounded text-[#2188ff]">NEXT_PUBLIC_API_URL</code>{" "}
                  environment variable
                </li>
              </ol>
            </div>
            <div className="space-y-3">
              <button
                onClick={startDemoMode}
                className="w-full github-blue-gradient hover:opacity-90 
                         text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 
                         flex items-center justify-center gap-3 message-shadow"
              >
                <Play className="w-5 h-5" />
                Try Demo Mode
              </button>
              <button
                onClick={checkAuth}
                disabled={loading}
                className="w-full bg-[#21262d] hover:bg-[#30363d] disabled:opacity-50 
                         text-[#f0f6fc] font-semibold py-3 px-6 rounded-lg transition-all duration-200 
                         flex items-center justify-center gap-3 metallic-border"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                {loading ? "Checking..." : "Check Backend Connection"}
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-[#30363d]">
              <p className="text-xs text-[#8b949e] mb-2">
                Current API endpoint:{" "}
                <code className="bg-[#21262d] px-1 rounded text-[#2188ff]">
                  {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}
                </code>
              </p>
              <p className="text-xs text-[#8b949e]">Demo mode uses mock data and simulated responses</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center metallic-gradient">
      <div className="max-w-md w-full mx-4">
        <div className="glass-effect metallic-border rounded-lg p-8 text-center">
          <div className="mb-8">
            <Github className="w-16 h-16 mx-auto mb-4 text-[#f0f6fc]" />
            <h1 className="text-3xl font-bold mb-2">GitHub Research Assistant</h1>
            <p className="text-[#8b949e]">Connect with GitHub to start your research journey</p>
          </div>
          {error && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          <button
            onClick={login}
            disabled={loading || backendConnected === false}
            className="w-full github-blue-gradient hover:opacity-90 disabled:opacity-50 
                     text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 
                     flex items-center justify-center gap-3 message-shadow"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
            {loading ? "Connecting..." : "Continue with GitHub"}
          </button>
          <p className="text-xs text-[#8b949e] mt-4">Secure authentication powered by GitHub OAuth</p>
        </div>
      </div>
    </div>
  )
}