'use client'

import { useState } from 'react'
import { CheckoutData } from '@/app/checkout/page'

interface AddressStepProps {
  data: CheckoutData
  updateData: (data: Partial<CheckoutData>) => void
  onNext: () => void
  onBack: () => void
}

export default function AddressStep({ data, updateData, onNext, onBack }: AddressStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePostalCode = (code: string) => {
    // Format français : 5 chiffres
    const regex = /^[0-9]{5}$/
    return regex.test(code)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.street.trim()) {
      newErrors.street = 'L\'adresse est requise'
    } else if (data.street.trim().length < 5) {
      newErrors.street = 'L\'adresse doit contenir au moins 5 caractères'
    }

    if (!data.city.trim()) {
      newErrors.city = 'La ville est requise'
    } else if (data.city.trim().length < 2) {
      newErrors.city = 'La ville doit contenir au moins 2 caractères'
    }

    if (!data.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis'
    } else if (!validatePostalCode(data.postalCode)) {
      newErrors.postalCode = 'Le code postal doit contenir 5 chiffres'
    }

    if (!data.country.trim()) {
      newErrors.country = 'Le pays est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  const handleChange = (field: keyof CheckoutData, value: string) => {
    updateData({ [field]: value })
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Adresse de livraison</h2>
        <p className="text-gray-600">
          Indiquez où vous souhaitez recevoir votre commande
        </p>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚚</span>
          <div>
            <p className="text-sm text-green-900 font-medium">Livraison rapide</p>
            <p className="text-sm text-green-700">
              Votre commande sera livrée sous 3 à 5 jours ouvrés
            </p>
          </div>
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
          Adresse complète <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="street"
          value={data.street}
          onChange={(e) => handleChange('street', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.street ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="15 rue de la Paix"
        />
        {errors.street && (
          <p className="mt-1 text-sm text-red-600">{errors.street}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Postal Code */}
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
            Code postal <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="postalCode"
            value={data.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            maxLength={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.postalCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="75001"
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={data.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Paris"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
          Pays <span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          value={data.country}
          onChange={(e) => handleChange('country', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.country ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="France">France</option>
          <option value="Belgique">Belgique</option>
          <option value="Suisse">Suisse</option>
          <option value="Luxembourg">Luxembourg</option>
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
        )}
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
          onClick={handleNext}
          className="w-full md:flex-1 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span>Continuer vers le paiement</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
