"use client"
import { useState, useEffect, useCallback } from "react"
import { api, type AuthStatus } from "@/lib/api"
export const useAuth = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const demoMode = localStorage.getItem("demo_mode")
      if (demoMode === "true") {
        const demoUser = localStorage.getItem("demo_user")
        if (demoUser) {
          setAuthStatus({
            authenticated: true,
            user: JSON.parse(demoUser),
          })
          setBackendConnected(true)
          setLoading(false)
          return
        }
      }
      const status = await api.checkAuth()
      setAuthStatus(status)
      setBackendConnected(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to check authentication status"
      setError(errorMessage)
      setBackendConnected(false)
      console.error("Auth check error:", err)
    } finally {
      setLoading(false)
    }
  }, [])
  const login = useCallback(() => {
    if (!backendConnected) {
      setError("Backend server is not connected. Please check your setup.")
      return
    }
    api.loginWithGitHub()
  }, [backendConnected])
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      const demoMode = localStorage.getItem("demo_mode")
      if (demoMode === "true") {
        localStorage.removeItem("demo_mode")
        localStorage.removeItem("demo_user")
        localStorage.removeItem("demo_messages")
        setAuthStatus({ authenticated: false })
        setLoading(false)
        return
      }
      await api.logout()
      setAuthStatus({ authenticated: false })
    } catch (err) {
      setError("Failed to logout")
      console.error("Logout error:", err)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  return {
    user: authStatus.user,
    authenticated: authStatus.authenticated,
    loading,
    error,
    backendConnected,
    login,
    logout,
    checkAuth,
  }
}