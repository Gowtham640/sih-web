'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, type AuthUser } from '../lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (username: string, password: string, type: 'coach' | 'athlete') => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = authService.getUserSession()
    setUser(savedUser)
    setLoading(false)
  }, [])

  const login = async (username: string, password: string, type: 'coach' | 'athlete'): Promise<boolean> => {
    setLoading(true)
    try {
      let userData: AuthUser | null = null

      if (type === 'coach') {
        userData = await authService.loginCoach(username, password)
      } else {
        userData = await authService.loginAthlete(username, password)
      }

      if (userData) {
        authService.setUserSession(userData)
        setUser(userData)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
