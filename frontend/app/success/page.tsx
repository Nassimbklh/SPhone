'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

interface OrderItem {
  product: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  _id: string
  items: OrderItem[]
  totalAmount: number
  status: string
  paymentStatus: string
  paidAt: string
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      setError('Session de paiement introuvable')
      setLoading(false)
      return
    }

    const fetchSession = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`http://localhost:5001/api/payment/session/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la récupération de la session')
        }

        setSessionData(data.data.session)
        setOrder(data.data.order)

        // Vider le panier après paiement réussi
        if (data.data.session.payment_status === 'paid') {
          clearCart()
        }
      } catch (err) {
        console.error('Erreur:', err)
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération de la commande')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [searchParams, router, clearCart])

  if (loading) {
    return (
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600">Vérification de votre paiement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/cart" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Retour au panier
          </Link>
        </div>
      </div>
    )
  }

  if (!order || !sessionData) {
    return (
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">❓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande introuvable</h1>
          <Link href="/products" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Continuer mes achats
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paiement réussi !</h1>
          <p className="text-gray-600">
            Merci pour votre commande. Vous recevrez un email de confirmation à l'adresse <strong>{sessionData.customer_email}</strong>
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Commande #{order._id.slice(-8)}</h2>
              <p className="text-sm text-gray-500">
                Payée le {new Date(order.paidAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              {order.paymentStatus === 'paid' ? 'Payé' : order.paymentStatus}
            </span>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Articles commandés</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{(item.price * item.quantity).toFixed(2)}€</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Adresse de livraison</h3>
              <p className="text-gray-600">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{order.totalAmount.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/orders"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-center"
          >
            Voir mes commandes
          </Link>
          <Link
            href="/products"
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors text-center"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
