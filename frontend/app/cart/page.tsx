'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryEmoji, translateLabel } from '@/lib/translations'
import { useRouter } from 'next/navigation'
import { getConditionLabel, getEtatLabel, getStorageLabel } from '@/lib/conditions'

export default function CartPage() {
  const router = useRouter()
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const totalPrice = getTotalPrice()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        // Sauvegarder l'URL de retour pour rediriger après connexion
        localStorage.setItem('redirectAfterLogin', '/cart')
        router.push('/auth/login')
        return
      }

      // Prepare cart items for the API
      const cartItems = items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        storage: item.storage,
        etat: item.etat,
        condition: item.condition, // Ancien système (rétrocompatibilité)
        color: item.selectedColor
      }))

      // Create Stripe checkout session
      const response = await fetch('http://localhost:5001/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: cartItems })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la session de paiement')
      }

      // Redirect to Stripe Checkout
      if (data.data.url) {
        window.location.href = data.data.url
      } else {
        throw new Error('URL de paiement non reçue')
      }
    } catch (err) {
      console.error('Erreur checkout:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">
            Découvrez notre sélection de produits et ajoutez vos favoris au panier
          </p>
          <Link href="/products" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Découvrir nos produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Panier</h1>
        <p className="text-gray-600">{items.length} article{items.length > 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item._id}-${item.storage || 'default'}-${item.etat || item.condition || 'default'}-${item.selectedColor || 'default'}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-5xl">{getCategoryEmoji(item.category)}</span>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  {/* Nouveau système: storage + etat */}
                  {item.storage && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Stockage:</span> {getStorageLabel(item.storage)}
                    </p>
                  )}
                  {item.etat && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">État:</span> {getEtatLabel(item.etat)}
                    </p>
                  )}
                  {/* Ancien système: condition */}
                  {!item.storage && !item.etat && item.condition && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">État:</span> {getConditionLabel(item.condition)}
                    </p>
                  )}
                  {item.selectedColor && (
                    <p className="text-sm text-gray-500 mb-2">{translateLabel('color')}: {item.selectedColor}</p>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">{item.price}€</span>
                    {item.pricePublic && item.pricePublic > item.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">{item.pricePublic}€</span>
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
                          -{Math.round(((item.pricePublic - item.price) / item.pricePublic) * 100)}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1, item.storage, item.etat, item.selectedColor)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1, item.storage, item.etat, item.selectedColor)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id, item.storage, item.etat, item.selectedColor)}
                      className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart Button */}
          <button
            onClick={clearCart}
            className="w-full py-3 text-red-600 hover:text-red-700 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Vider le panier
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total ({items.length} article{items.length > 1 ? 's' : ''})</span>
                <span className="font-semibold">{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span className="font-semibold">{totalPrice >= 50 ? 'Gratuite' : '4.99€'}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {totalPrice < 50 && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  Plus que {(50 - totalPrice).toFixed(2)}€ pour la livraison gratuite !
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Préparation du paiement...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Passer la commande</span>
                </>
              )}
            </button>

            <Link
              href="/products"
              className="block w-full text-center py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
