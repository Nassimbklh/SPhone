'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

interface OrderItem {
  product: {
    _id: string
    name: string
    images?: string[]
  }
  name: string
  quantity: number
  price: number
  color?: string
}

interface Order {
  _id: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  isPaid: boolean
  isDelivered: boolean
  paidAt?: string
  deliveredAt?: string
  createdAt: string
  shippingAddress: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  shippingPrice: number
  taxPrice: number
  user: {
    _id: string
    name?: string
    email: string
  }
}

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const { user, token, isLoading: authLoading, isAuthenticated } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch order details
  useEffect(() => {
    if (isAuthenticated && token && orderId) {
      fetchOrder()
    }
  }, [isAuthenticated, token, orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setOrder(data.data.order)
      } else {
        setError(data.message || 'Erreur lors du chargement de la commande')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Erreur lors du chargement de la commande')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'En attente', icon: '⏳' },
      paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Payé', icon: '✓' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Expédié', icon: '🚚' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Livré', icon: '✓' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Annulé', icon: '✗' }
    }
    const badge = badges[status as keyof typeof badges] || badges.pending
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${badge.bg} ${badge.text}`}>
        <span>{badge.icon}</span>
        {badge.label}
      </span>
    )
  }

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid ? (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-green-100 text-green-700">
        <span>✓</span>
        Payé
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700">
        <span>✗</span>
        Non payé
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatOrderId = (id: string) => {
    return `#${id.slice(-8).toUpperCase()}`
  }

  const calculateSubtotal = () => {
    if (!order) return 0
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (authLoading || loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la commande...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  if (error || !order) {
    return (
      <div className="container-custom py-12">
        <div className="bg-white rounded-xl border border-red-200 p-12 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Commande introuvable</h3>
          <p className="text-gray-600 mb-6">{error || 'Cette commande n\'existe pas'}</p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            ← Retour à mes commandes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-5xl">
        {/* Back Button */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à mes commandes
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Commande {formatOrderId(order._id)}
              </h1>
              <p className="text-gray-600">
                Passée le {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {getPaymentBadge(order.isPaid)}
              {getStatusBadge(order.status)}
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Commande créée</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </div>

              {order.paidAt && (
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Paiement reçu</p>
                      <p className="text-sm text-gray-500">{formatDate(order.paidAt)}</p>
                    </div>
                  </div>
                </div>
              )}

              {order.status === 'shipped' && (
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      🚚
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Expédiée</p>
                      <p className="text-sm text-gray-500">En cours de livraison</p>
                    </div>
                  </div>
                </div>
              )}

              {order.deliveredAt && (
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Livrée</p>
                      <p className="text-sm text-gray-500">{formatDate(order.deliveredAt)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products List */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Produits ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      {item.color && (
                        <p className="text-sm text-gray-500 mb-2">
                          Couleur: {item.color}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Quantité: {item.quantity}
                        </p>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {item.price.toFixed(2)}€ × {item.quantity}
                          </p>
                          <p className="font-bold text-gray-900">
                            {(item.price * item.quantity).toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Adresse de livraison
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 font-medium">
                  {order.shippingAddress.street}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{calculateSubtotal().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{order.shippingPrice.toFixed(2)}€</span>
                </div>
                {order.taxPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>TVA</span>
                    <span>{order.taxPrice.toFixed(2)}€</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {order.totalAmount.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Méthode de paiement
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="capitalize">{order.paymentMethod === 'stripe' ? 'Carte bancaire (Stripe)' : order.paymentMethod}</span>
                </div>
              </div>

              {/* Need Help */}
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Besoin d'aide ?
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Notre équipe est là pour vous
                  </p>
                  <Link
                    href="/contact"
                    className="block text-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
