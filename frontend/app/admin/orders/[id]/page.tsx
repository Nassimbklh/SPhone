'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setOrder(data.data.order)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async () => {
    if (!confirm('Marquer cette commande comme payee ?')) return

    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: 'admin-payment',
          status: 'completed'
        })
      })

      if (response.ok) {
        alert('Commande marquee comme payee !')
        fetchOrder()
      } else {
        alert('Erreur lors de la mise a jour')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise a jour')
    } finally {
      setUpdating(false)
    }
  }

  const handleMarkDelivered = async () => {
    if (!confirm('Marquer cette commande comme livree ?')) return

    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Commande marquee comme livree !')
        fetchOrder()
      } else {
        alert('Erreur lors de la mise a jour')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise a jour')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20">Chargement...</div>
  }

  if (!order) {
    return <div className="text-center py-20">Commande non trouvee</div>
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Commande #{order._id.slice(-8)}</h1>
          <p className="text-gray-600">Creee le {new Date(order.createdAt).toLocaleString('fr-FR')}</p>
        </div>
        <Link href="/admin/orders" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          Retour
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Articles commandes</h2>
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      Quantité: {item.quantity} × {item.price}€
                      {item.color && ` • Couleur: ${item.color}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{(item.quantity * item.price).toFixed(2)}€</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{(order.totalAmount - order.shippingPrice - order.taxPrice).toFixed(2)}€</span>
              </div>
              {order.shippingPrice > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Frais de port</span>
                  <span>{order.shippingPrice}€</span>
                </div>
              )}
              {order.taxPrice > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>{order.taxPrice}€</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">{order.totalAmount}€</span>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Adresse de livraison</h2>
              <div className="text-gray-700 space-y-1">
                {order.shippingAddress.street && <div>{order.shippingAddress.street}</div>}
                {order.shippingAddress.city && order.shippingAddress.postalCode && (
                  <div>{order.shippingAddress.postalCode} {order.shippingAddress.city}</div>
                )}
                {order.shippingAddress.country && <div>{order.shippingAddress.country}</div>}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Informations client</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Nom</div>
                <div className="font-medium">{order.user?.name || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{order.user?.email || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Statut de la commande</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Statut general</div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                  order.status === 'paid' ? 'bg-green-100 text-green-600' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                  order.status === 'delivered' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {order.status}
                </span>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Paiement</div>
                {order.isPaid ? (
                  <div className="text-green-600 font-medium">
                    ✓ Payee le {new Date(order.paidAt).toLocaleDateString('fr-FR')}
                  </div>
                ) : (
                  <div className="text-orange-600 font-medium">⏳ En attente</div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Livraison</div>
                {order.isDelivered ? (
                  <div className="text-green-600 font-medium">
                    ✓ Livree le {new Date(order.deliveredAt).toLocaleDateString('fr-FR')}
                  </div>
                ) : (
                  <div className="text-orange-600 font-medium">⏳ Non livree</div>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <div>Methode: {order.paymentMethod || 'stripe'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Actions admin</h2>
            <div className="space-y-3">
              {!order.isPaid && (
                <button
                  onClick={handleMarkPaid}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  Marquer comme payee
                </button>
              )}

              {order.isPaid && !order.isDelivered && (
                <button
                  onClick={handleMarkDelivered}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  Marquer comme livree
                </button>
              )}

              {order.isPaid && order.isDelivered && (
                <div className="text-center py-3 text-green-600 font-medium">
                  ✓ Commande completee
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
