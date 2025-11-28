'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore()
  const [showDropdown, setShowDropdown] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  const handleLogout = () => {
    logoutStore()
    setShowDropdown(false)
    router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            S.phone
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Accueil
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Produits
            </Link>
            <Link href="/qui-sommes-nous" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Qui sommes-nous ?
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Panier
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-base">
                    {user.firstname?.[0]?.toUpperCase()}{user.lastname?.[0]?.toUpperCase()}
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-soft-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mon Profil
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Mes commandes
                      </Link>

                      {user.role === 'admin' && (
                        <>
                          <div className="border-t border-gray-100 my-2"></div>
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                            onClick={() => setShowDropdown(false)}
                          >
                            <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Panneau Administrateur
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Deconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/register" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Inscription
                </Link>
                <Link href="/auth/login" className="btn-primary text-sm px-5 py-2">
                  Connexion
                </Link>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative ml-4">
            <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden mt-4 flex items-center justify-around py-2 border-t border-gray-200 pt-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
            Accueil
          </Link>
          <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
            Produits
          </Link>
          {isAuthenticated && user ? (
            <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              {user.firstname}
            </Link>
          ) : (
            <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Connexion
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
