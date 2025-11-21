'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireAuth?: boolean
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireAuth = true
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      // If authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        router.push('/auth/login')
        return
      }

      // If admin is required but user is not admin
      if (requireAdmin && user?.role !== 'admin') {
        router.push('/')
        return
      }
    }
  }, [isLoading, isAuthenticated, user, requireAuth, requireAdmin, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verification...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Don't render if admin required but user is not admin (will redirect)
  if (requireAdmin && user?.role !== 'admin') {
    return null
  }

  // Render children if all checks pass
  return <>{children}</>
}
