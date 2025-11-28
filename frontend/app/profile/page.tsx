'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const isLoading = false // Plus besoin de isLoading avec Zustand

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login'
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Mon Profil</h1>
            <p className="text-gray-600">Gerez vos informations personnelles</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Prenom
                      </label>
                      <p className="text-lg font-medium text-gray-900">{user.firstname}</p>
                    </div>
                    <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Modifier
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nom
                      </label>
                      <p className="text-lg font-medium text-gray-900">{user.lastname}</p>
                    </div>
                    <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Modifier
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Adresse email
                      </label>
                      <p className="text-lg font-medium text-gray-900">{user.email}</p>
                    </div>
                    <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Modifier
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Telephone
                      </label>
                      <p className="text-lg font-medium text-gray-900">{user.phone}</p>
                    </div>
                    <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Modifier
                    </button>
                  </div>

                  <div className={`flex items-center justify-between ${user.role === 'admin' ? 'pb-6 border-b border-gray-200' : ''}`}>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Mot de passe
                      </label>
                      <p className="text-lg font-medium text-gray-900">••••••••</p>
                    </div>
                    <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Changer
                    </button>
                  </div>

                  {/* Afficher le rôle uniquement pour les administrateurs */}
                  {user.role === 'admin' && (
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Role
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-600">
                            Administrateur
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des commandes</h2>
                <div className="text-center py-12 text-gray-600">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">Aucune commande pour le moment</p>
                  <p className="text-sm mb-4">Commencez vos achats des maintenant</p>
                  <Link href="/products" className="btn-primary inline-block">
                    Parcourir les produits
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Compte</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Membre depuis
                  </div>
                  <div className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block w-full px-4 py-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 font-medium text-center transition-colors"
                    >
                      Panneau Administrateur
                    </Link>
                  )}
                  <Link
                    href="/cart"
                    className="block w-full px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-medium text-center transition-colors"
                  >
                    Mon Panier
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      router.push('/auth/login')
                    }}
                    className="w-full px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium transition-colors"
                  >
                    Se deconnecter
                  </button>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Commandes</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total depense</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">0.00€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
