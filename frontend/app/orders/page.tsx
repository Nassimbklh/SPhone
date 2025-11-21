'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { getCategoryEmoji } from '@/lib/translations'

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
  createdAt: string
  deliveredAt?: string
  paidAt?: string
  shippingAddress: {
    street: string
    city: string
    postalCode: string
    country: string
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, token, isLoading: authLoading, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch orders
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders()
    }
  }, [isAuthenticated, token])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setOrders(data.data.orders)
      } else {
        setError(data.message || 'Erreur lors du chargement des commandes')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'En attente' },
      paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Payé' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Expédié' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Livré' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Annulé' }
    }
    const badge = badges[status as keyof typeof badges] || badges.pending
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid ? (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        ✓ Payé
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Non payé
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatOrderId = (id: string) => {
    return `#${id.slice(-8).toUpperCase()}`
  }

  const handleDeleteOrder = async (orderId: string, orderStatus: string) => {
    // Empêcher la suppression des commandes payées
    if (orderStatus === 'paid' || orderStatus === 'shipped' || orderStatus === 'delivered') {
      alert('❌ Impossible de supprimer une commande payée ou en cours de traitement. Contactez le support.')
      return
    }

    const confirmation = window.confirm(
      '⚠️ Êtes-vous sûr de vouloir supprimer cette commande ?\n\nCette action est irréversible.'
    )

    if (!confirmation) return

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Commande supprimée avec succès')
        // Rafraîchir la liste des commandes
        fetchOrders()
      } else {
        alert(`❌ ${data.message || 'Erreur lors de la suppression'}`)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('❌ Erreur lors de la suppression de la commande')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes commandes</h1>
          <p className="text-gray-600">Historique complet de vos achats</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore passé de commande
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Commande {formatOrderId(order._id)}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Passée le {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {order.totalAmount.toFixed(2)}€
                      </p>
                      {getPaymentBadge(order.isPaid)}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-6">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                      {order.items.slice(0, 4).map((item, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-w-[200px]"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl">
                            📦
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qté: {item.quantity} • {item.price.toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/orders/${order._id}`}
                      className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      Voir la commande
                    </Link>
                    {order.isDelivered ? (
                      <span className="text-center px-6 py-3 bg-green-50 text-green-700 rounded-lg font-medium border border-green-200">
                        ✓ Livré le {order.deliveredAt ? formatDate(order.deliveredAt) : ''}
                      </span>
                    ) : (
                      order.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteOrder(order._id, order.status)}
                          className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors border border-red-200"
                        >
                          🗑️ Supprimer
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
