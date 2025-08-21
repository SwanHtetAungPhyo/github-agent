const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
export interface AuthStatus {
  authenticated: boolean
  user?: {
    id: number
    login: string
    name: string
    email: string
    avatar_url: string
  }
}
export interface ChatResponse {
  success: boolean
  threadId: string
  message: string
  details: {
    finishReason: string
    usage: any
    toolsUsed: string[]
    timestamp: string
  }
  toolResults?: Array<{
    toolName: string
    result: any
  }>
}
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: "GET",
      credentials: "include",
    })
    return response.ok
  } catch (error) {
    return false
  }
}
export const api = {
  checkAuth: async (): Promise<AuthStatus> => {
    try {
      const response = await fetch(`${API_BASE}/auth/status`, {
        credentials: "include",
        signal: AbortSignal.timeout(5000), 
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Auth check failed:", error)
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Backend server is not responding. Please ensure your backend is running on " + API_BASE)
        }
        if (error.message.includes("Failed to fetch")) {
          throw new Error("Cannot connect to backend server. Please check if your backend is running on " + API_BASE)
        }
      }
      throw error
    }
  },
  loginWithGitHub: () => {
    window.location.href = `${API_BASE}/auth/github`
  },
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/github/logout`, {
        method: "POST",
        credentials: "include",
        signal: AbortSignal.timeout(5000),
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  },
  chat: async (message: string, threadId?: string): Promise<ChatResponse> => {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, threadId }),
        signal: AbortSignal.timeout(30000), 
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Chat request failed:", error)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.")
      }
      throw error
    }
  },
}