'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

function OrderSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/products')
      return
    }

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setOrder(data.data.order)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-3xl">
        {/* Success Message */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Commande confirmée !
          </h1>
          <p className="text-gray-600 mb-6">
            Merci pour votre achat. Votre commande a été enregistrée avec succès.
          </p>

          {order && (
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
              <p className="text-sm text-blue-900 font-medium">
                Numéro de commande
              </p>
              <p className="text-lg font-bold text-blue-600">
                #{order._id.slice(-8).toUpperCase()}
              </p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Détails de la commande</h2>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Statut</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  {order.status === 'pending' ? 'En attente' : order.status}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Montant total</span>
                <span className="font-bold text-gray-900">{order.totalAmount.toFixed(2)}€</span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Mode de paiement</span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod === 'card' ? 'Carte bancaire' : 'Paylib'}
                </span>
              </div>

              {/* Shipping Address */}
              <div className="py-3">
                <span className="text-gray-600 block mb-2">Adresse de livraison</span>
                <div className="text-gray-900">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Et maintenant ?</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Confirmation par email</h3>
                <p className="text-sm text-gray-600">
                  Vous allez recevoir un email de confirmation avec tous les détails de votre commande.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📦</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Préparation de la commande</h3>
                <p className="text-sm text-gray-600">
                  Votre commande sera préparée et expédiée dans les plus brefs délais.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🚚</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Livraison</h3>
                <p className="text-sm text-gray-600">
                  Vous recevrez votre commande sous 3 à 5 jours ouvrés.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/profile/orders"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-center"
          >
            Voir mes commandes
          </Link>
          <Link
            href="/products"
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-center"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
