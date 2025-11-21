'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    } else if (!isLoading && user && user.role !== 'admin') {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gradient">Panneau Administrateur</h1>
          </div>

          <nav className="space-y-2">
            <Link href="/admin" className="block px-4 py-3 rounded-xl hover:bg-gray-50 transition-all text-gray-700 hover:text-gray-900">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <span className="font-medium">Tableau de bord</span>
              </div>
            </Link>

            <Link href="/admin/products" className="block px-4 py-3 rounded-xl hover:bg-gray-50 transition-all text-gray-700 hover:text-gray-900">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <span className="font-medium">Produits</span>
              </div>
            </Link>

            <Link href="/admin/orders" className="block px-4 py-3 rounded-xl hover:bg-gray-50 transition-all text-gray-700 hover:text-gray-900">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛍️</span>
                <span className="font-medium">Commandes</span>
              </div>
            </Link>

            <Link href="/admin/best-sellers" className="block px-4 py-3 rounded-xl hover:bg-gray-50 transition-all text-gray-700 hover:text-gray-900">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <span className="font-medium">Meilleures ventes</span>
              </div>
            </Link>

            <button onClick={logout} className="w-full px-4 py-3 rounded-xl hover:bg-red-50 transition-all text-left text-red-600 mt-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚪</span>
                <span className="font-medium">Deconnexion</span>
              </div>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <header className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900">Administration</h2>
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}
