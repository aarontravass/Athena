'use client'
import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import auth from '@/lib/auth'
import { useLogout } from '@privy-io/react-auth'

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

  const { logout } = useLogout({
    onSuccess: async () => {
      try {
        console.log('Successfully logged out')
        localStorage.clear()
        console.log('Token cleared')
        await auth.logout()
        console.log('Cookie cleared')
        checkAuth()
        router.push('/login')
      } catch (error) {
        console.error('Error during logout process:', error)
      }
    }
  })

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
    console.log('Before')
    try {
      await logout()
    } catch (error) {
      console.error('Error during logout:', error)
    }
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
