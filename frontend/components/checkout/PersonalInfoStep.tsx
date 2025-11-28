'use client'

import { useState } from 'react'
import { CheckoutData } from '@/app/checkout/page'

interface PersonalInfoStepProps {
  data: CheckoutData
  updateData: (data: Partial<CheckoutData>) => void
  onNext: () => void
}

export default function PersonalInfoStep({ data, updateData, onNext }: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validatePhone = (phone: string) => {
    const regex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
    return regex.test(phone)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.firstname.trim()) {
      newErrors.firstname = 'Le prénom est requis'
    } else if (data.firstname.trim().length < 2) {
      newErrors.firstname = 'Le prénom doit contenir au moins 2 caractères'
    }

    if (!data.lastname.trim()) {
      newErrors.lastname = 'Le nom est requis'
    } else if (data.lastname.trim().length < 2) {
      newErrors.lastname = 'Le nom doit contenir au moins 2 caractères'
    }

    if (!data.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Veuillez fournir un email valide'
    }

    if (!data.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    } else if (!validatePhone(data.phone)) {
      newErrors.phone = 'Veuillez fournir un numéro de téléphone valide'
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations personnelles</h2>
        <p className="text-gray-600">
          Vérifiez et complétez vos informations personnelles
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="text-sm text-blue-900 font-medium">Information pré-remplie</p>
            <p className="text-sm text-blue-700">
              Vos informations sont automatiquement remplies depuis votre profil. Vous pouvez les modifier si nécessaire.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firstname */}
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstname"
            value={data.firstname}
            onChange={(e) => handleChange('firstname', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.firstname ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Jean"
          />
          {errors.firstname && (
            <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
          )}
        </div>

        {/* Lastname */}
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastname"
            value={data.lastname}
            onChange={(e) => handleChange('lastname', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.lastname ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Dupont"
          />
          {errors.lastname && (
            <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="jean.dupont@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="+33 6 12 34 56 78"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={handleNext}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span>Continuer vers l'adresse</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
