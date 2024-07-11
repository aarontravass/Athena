// components/AuthProvider.tsx
'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import auth from '@/lib/auth'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  authLogin: (token: string) => Promise<void>
  authLogout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(() => {
    const authStatus = auth.isAuthenticated()
    setIsAuthenticated(authStatus)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    console.log('hello Auth Provider')
    checkAuth()
  }, [checkAuth])

  const authLogin = useCallback(
    async (token: string) => {
      await auth.saveToken(token)
      checkAuth()
    },
    [checkAuth]
  )

  const authLogout = useCallback(async () => {
    await auth.logout()
    checkAuth()
    router.push('/login')
  }, [checkAuth, router])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, authLogin, authLogout }}>
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
