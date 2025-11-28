'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import PersonalInfoStep from '@/components/checkout/PersonalInfoStep'
import AddressStep from '@/components/checkout/AddressStep'
import PaymentStep from '@/components/checkout/PaymentStep'
import OrderSummary from '@/components/checkout/OrderSummary'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export interface CheckoutData {
  // Personal info
  firstname: string
  lastname: string
  email: string
  phone: string

  // Address
  street: string
  city: string
  postalCode: string
  country: string

  // Payment
  paymentMethod: 'card' | 'paylib' | null
  cardNumber?: string
  cardExpiry?: string
  cardCvv?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, token, isAuthenticated } = useAuthStore()
  const { items, getTotalPrice } = useCartStore()

  const [currentStep, setCurrentStep] = useState(1)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    paymentMethod: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  // Redirect if not authenticated - avec délai pour permettre l'hydratation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', '/checkout')
        router.push('/auth/login')
      } else {
        setHasCheckedAuth(true)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (hasCheckedAuth && items.length === 0) {
      router.push('/cart')
    }
  }, [items, router, hasCheckedAuth])

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setCheckoutData(prev => ({
        ...prev,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'France',
      }))
    }
  }, [user])

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: '👤' },
    { number: 2, title: 'Adresse de livraison', icon: '📍' },
    { number: 3, title: 'Paiement', icon: '💳' },
  ]

  if (!hasCheckedAuth || !isAuthenticated || items.length === 0) {
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
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finaliser ma commande</h1>
          <p className="text-gray-600">Complétez les étapes pour valider votre achat</p>
        </div>

        {/* Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                      currentStep === step.number
                        ? 'bg-blue-600 text-white scale-110'
                        : currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? '✓' : step.icon}
                  </div>
                  <p
                    className={`mt-2 text-xs font-medium text-center ${
                      currentStep === step.number ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 transition-all ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <PersonalInfoStep
                  data={checkoutData}
                  updateData={updateCheckoutData}
                  onNext={nextStep}
                />
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <AddressStep
                  data={checkoutData}
                  updateData={updateCheckoutData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <PaymentStep
                  data={checkoutData}
                  updateData={updateCheckoutData}
                  onBack={prevStep}
                  cartItems={items}
                  totalAmount={getTotalPrice()}
                  token={token}
                  onError={setError}
                  onLoading={setLoading}
                />
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary items={items} />
          </div>
        </div>
      </div>
    </div>
  )
}
