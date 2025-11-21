'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  _id: string
  firstname: string
  lastname: string
  email: string
  phone: string
  role: 'user' | 'admin'
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (firstname: string, lastname: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const API_URL = 'http://localhost:5001/api'

export function useAuth(): AuthState & AuthActions {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      // Verify token is still valid
      verifyToken(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  // Verify token with backend
  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data.user)
        localStorage.setItem('user', JSON.stringify(data.data.user))
      } else {
        // Token invalid or expired, clear auth
        console.log('Token invalide ou expire, deconnexion automatique')
        logout()
      }
    } catch (error) {
      console.error('Token verification error:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const { token: authToken, user: userData } = data.data

        // Store in state
        setToken(authToken)
        setUser(userData)

        // Store in localStorage
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))

        // Check for redirect URL (saved before login)
        const redirectUrl = localStorage.getItem('redirectAfterLogin')

        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin')
          router.push(redirectUrl)
        } else {
          // Default redirect based on role
          if (userData.role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/profile')
          }
        }

        return { success: true }
      } else {
        return { success: false, message: data.message || 'Erreur de connexion' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Erreur de connexion au serveur' }
    }
  }

  // Register function
  const register = async (firstname: string, lastname: string, email: string, phone: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname, lastname, email, phone, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const { token: authToken, user: userData } = data.data

        // Store in state
        setToken(authToken)
        setUser(userData)

        // Store in localStorage
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))

        // Check for redirect URL (saved before registration)
        const redirectUrl = localStorage.getItem('redirectAfterLogin')

        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin')
          router.push(redirectUrl)
        } else {
          // Default redirect to profile
          router.push('/profile')
        }

        return { success: true }
      } else {
        return { success: false, message: data.message || 'Erreur lors de l\'inscription' }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, message: 'Erreur de connexion au serveur' }
    }
  }

  // Logout function
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  // Refresh user data
  const refreshUser = async () => {
    if (!token) return

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data.user)
        localStorage.setItem('user', JSON.stringify(data.data.user))
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshUser
  }
}
