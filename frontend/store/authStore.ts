import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  _id: string
  firstname: string
  lastname: string
  email: string
  role: 'admin' | 'user'
  address?: {
    street?: string
    city?: string
    postalCode?: string
    country?: string
  }
  phone?: string
  createdAt?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // Actions
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },

      updateUser: (user: User) => {
        set({ user })
      },

      setToken: (token: string) => {
        set({ token })
      },
    }),
    {
      name: 'auth-storage', // nom dans localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
