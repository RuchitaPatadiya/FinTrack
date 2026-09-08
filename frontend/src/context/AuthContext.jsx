import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fintrack_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('fintrack_token') || null)
  const [loading, setLoading] = useState(true)

  // Verify and refresh user profile on initial app load if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fintrack_token')
      if (storedToken) {
        try {
          const res = await authAPI.getProfile()
          setUser(res.data)
          localStorage.setItem('fintrack_user', JSON.stringify(res.data))
        } catch (err) {
          console.error("Token verification failed, logging out:", err)
          logout()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const handleAuthSuccess = async (accessToken) => {
    setToken(accessToken)
    localStorage.setItem('fintrack_token', accessToken)
    const profileRes = await authAPI.getProfile()
    setUser(profileRes.data)
    localStorage.setItem('fintrack_user', JSON.stringify(profileRes.data))
    return profileRes.data
  }

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    return await handleAuthSuccess(res.data.access_token)
  }

  const register = async (email, password, fullName) => {
    await authAPI.register({ email, password, full_name: fullName })
    // Automatically log in after successful registration
    return await login(email, password)
  }

  const loginWithGoogle = async (credential) => {
    const res = await authAPI.googleAuth(credential)
    return await handleAuthSuccess(res.data.access_token)
  }

  const forgotPassword = async (email) => {
    const res = await authAPI.forgotPassword(email)
    return res.data
  }

  const resetPassword = async (resetToken, newPassword) => {
    const res = await authAPI.resetPassword(resetToken, newPassword)
    return res.data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('fintrack_token')
    localStorage.removeItem('fintrack_user')
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    resetPassword,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
