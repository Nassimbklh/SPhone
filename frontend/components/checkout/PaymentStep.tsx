'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutData } from '@/app/checkout/page'
import { useCartStore } from '@/store/cartStore'

interface PaymentStepProps {
  data: CheckoutData
  updateData: (data: Partial<CheckoutData>) => void
  onBack: () => void
  cartItems: any[]
  totalAmount: number
  token: string | null
  onError: (error: string) => void
  onLoading: (loading: boolean) => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export default function PaymentStep({
  data,
  updateData,
  onBack,
  cartItems,
  totalAmount,
  token,
  onError,
  onLoading,
}: PaymentStepProps) {
  const router = useRouter()
  const { clearCart } = useCartStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paylib' | null>(data.paymentMethod)

  // Card validation
  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    return /^[0-9]{16}$/.test(cleaned)
  }

  const validateExpiry = (expiry: string) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!regex.test(expiry)) return false

    const [month, year] = expiry.split('/')
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1

    const expiryYear = parseInt(year)
    const expiryMonth = parseInt(month)

    if (expiryYear < currentYear) return false
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false

    return true
  }

  const validateCVV = (cvv: string) => {
    return /^[0-9]{3}$/.test(cvv)
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ').substring(0, 19) // 16 digits + 3 spaces
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const handlePaymentMethodChange = (method: 'card' | 'paylib') => {
    setPaymentMethod(method)
    updateData({ paymentMethod: method })
    setErrors({})
  }

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    updateData({ cardNumber: formatted })
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }))
    }
  }

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiry(value)
    updateData({ cardExpiry: formatted })
    if (errors.cardExpiry) {
      setErrors(prev => ({ ...prev, cardExpiry: '' }))
    }
  }

  const handleCVVChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 3)
    updateData({ cardCvv: cleaned })
    if (errors.cardCvv) {
      setErrors(prev => ({ ...prev, cardCvv: '' }))
    }
  }

  const validatePayment = () => {
    const newErrors: Record<string, string> = {}

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Veuillez sélectionner un mode de paiement'
      setErrors(newErrors)
      return false
    }

    if (paymentMethod === 'card') {
      if (!data.cardNumber || !validateCardNumber(data.cardNumber)) {
        newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres requis)'
      }

      if (!data.cardExpiry || !validateExpiry(data.cardExpiry)) {
        newErrors.cardExpiry = 'Date d\'expiration invalide (MM/AA)'
      }

      if (!data.cardCvv || !validateCVV(data.cardCvv)) {
        newErrors.cardCvv = 'CVV invalide (3 chiffres requis)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitOrder = async () => {
    if (!validatePayment()) {
      return
    }

    onLoading(true)
    onError('')

    try {
      // Calculer les frais de livraison
      const shippingPrice = totalAmount >= 50 ? 0 : 4.99

      // Préparer les données de commande
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          storage: item.storage,
          etat: item.etat,
          condition: item.condition,
          color: item.selectedColor,
        })),
        shippingAddress: {
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
        paymentMethod: paymentMethod,
        shippingPrice: shippingPrice,
        taxPrice: 0,
      }

      // Créer la commande
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la création de la commande')
      }

      // Vider le panier
      clearCart()

      // Rediriger vers la page de succès
      router.push(`/order-success?orderId=${result.data.order._id}`)
    } catch (err) {
      console.error('Erreur lors de la commande:', err)
      onError(err instanceof Error ? err.message : 'Une erreur est survenue lors du paiement')
    } finally {
      onLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mode de paiement</h2>
        <p className="text-gray-600">
          Choisissez votre méthode de paiement sécurisée
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-700">
          Sélectionnez un mode de paiement <span className="text-red-500">*</span>
        </p>

        {/* Card Payment */}
        <div
          onClick={() => handlePaymentMethodChange('card')}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === 'card'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'card' ? 'border-blue-600' : 'border-gray-300'
              }`}
            >
              {paymentMethod === 'card' && (
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <h3 className="font-semibold text-gray-900">Carte bancaire</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Visa, Mastercard, American Express
              </p>
            </div>
            <div className="flex gap-2">
              <img src="/visa.svg" alt="Visa" className="h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
              <img src="/mastercard.svg" alt="Mastercard" className="h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
          </div>

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  value={data.cardNumber || ''}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'expiration
                  </label>
                  <input
                    type="text"
                    value={data.cardExpiry || ''}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="MM/AA"
                    maxLength={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cardExpiry ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.cardExpiry && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                  )}
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={data.cardCvv || ''}
                    onChange={(e) => handleCVVChange(e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cardCvv ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.cardCvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardCvv}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Paylib Payment */}
        <div
          onClick={() => handlePaymentMethodChange('paylib')}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === 'paylib'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'paylib' ? 'border-blue-600' : 'border-gray-300'
              }`}
            >
              {paymentMethod === 'paylib' && (
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <h3 className="font-semibold text-gray-900">Paylib</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Paiement sécurisé par mobile
              </p>
            </div>
          </div>

          {paymentMethod === 'paylib' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Vous serez redirigé vers l'application Paylib pour finaliser votre paiement de manière sécurisée.
              </p>
            </div>
          )}
        </div>

        {errors.paymentMethod && (
          <p className="text-sm text-red-600">{errors.paymentMethod}</p>
        )}
      </div>

      {/* Security Notice */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="text-sm text-gray-900 font-medium">Paiement 100% sécurisé</p>
            <p className="text-sm text-gray-600 mt-1">
              Vos informations de paiement sont cryptées et sécurisées. Nous ne conservons jamais vos données bancaires.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row gap-4">
        <button
          onClick={onBack}
          className="w-full md:w-auto px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span>Retour</span>
        </button>
        <button
          onClick={handleSubmitOrder}
          className="w-full md:flex-1 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Finaliser ma commande ({(totalAmount + (totalAmount >= 50 ? 0 : 4.99)).toFixed(2)}€)</span>
        </button>
      </div>
    </div>
  )
}
