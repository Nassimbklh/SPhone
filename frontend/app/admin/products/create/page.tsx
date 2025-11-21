'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SmartProductSelector } from '@/components/admin/SmartProductSelector'
import { VariantsManager } from '@/components/admin/VariantsManager'
import { SpecificationsManager } from '@/components/admin/SpecificationsManager'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { requiresStorage } from '@/lib/products-data'
import type { ProductVariants } from '@/lib/conditions'

// API URL with fallback for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

interface FormErrors {
  [key: string]: string
}

interface Specification {
  label: string
  value: string
}

export default function CreateProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Basic information
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [description, setDescription] = useState('')

  // Variants (for phones and watches)
  const [variants, setVariants] = useState<ProductVariants>({})

  // Simple pricing (for other categories)
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')

  // Specifications
  const [specifications, setSpecifications] = useState<Specification[]>([])

  // Images
  const [images, setImages] = useState<string[]>([])

  const needsVariants = category && requiresStorage(category)

  // Générer automatiquement le nom du produit avec marque + modèle
  const productName = `${brand} ${model}`.trim()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Basic fields
    if (!category) newErrors.category = 'La catégorie est requise'
    if (!brand) newErrors.brand = 'La marque est requise'
    if (!model) newErrors.model = 'Le modèle est requis'
    if (!description.trim()) newErrors.description = 'La description est requise'

    // Images
    if (images.length === 0) {
      newErrors.images = 'Au moins une image est requise'
    }

    // Variants validation (for phones/watches)
    if (needsVariants) {
      const storages = Object.keys(variants)

      if (storages.length === 0) {
        newErrors.storages = 'Au moins une capacité de stockage est requise'
      } else {
        let hasAtLeastOneCompleteVariant = false
        let variantErrors: string[] = []

        storages.forEach(storage => {
          const etats = Object.keys(variants[storage])

          etats.forEach(etat => {
            const variant = variants[storage][etat]

            if (variant) {
              // Déterminer si l'état est "vide" ou "partiellement rempli"
              const hasPrix = variant.prix && variant.prix > 0
              const hasCouleurs = variant.couleurs && variant.couleurs.length > 0
              const hasValidCouleurs = hasCouleurs && variant.couleurs.some((c: any) => c.nom && c.nom.trim() !== '')

              // Si l'état est complètement vide (pas de prix ET pas de couleurs valides), on l'ignore
              const isEmpty = !hasPrix && !hasValidCouleurs

              if (isEmpty) {
                // Ignorer les états vides - ils seront filtrés lors de la soumission
                return
              }

              // Si l'état a des données, on valide qu'il est complet
              let isComplete = true

              if (!hasPrix) {
                variantErrors.push(`${storage} Go - ${etat}: Le prix est requis (ou supprimez cet état)`)
                isComplete = false
              }

              if (!hasValidCouleurs) {
                variantErrors.push(`${storage} Go - ${etat}: Au moins une couleur avec nom est requise (ou supprimez cet état)`)
                isComplete = false
              } else {
                // Vérifier que chaque couleur avec un nom a un stock valide
                variant.couleurs.forEach((couleur: any, idx: number) => {
                  if (couleur.nom && couleur.nom.trim()) {
                    if (couleur.stock === undefined || couleur.stock < 0) {
                      variantErrors.push(`${storage} Go - ${etat}: La couleur "${couleur.nom}" doit avoir un stock (minimum 0)`)
                      isComplete = false
                    }
                  }
                })
              }

              if (isComplete) {
                hasAtLeastOneCompleteVariant = true
              }
            }
          })
        })

        if (!hasAtLeastOneCompleteVariant) {
          newErrors.variants = 'Au moins un état complet (avec prix et couleurs) est requis'
        }

        if (variantErrors.length > 0) {
          newErrors.variants = variantErrors.join(' | ')
        }
      }
    } else {
      // Simple price/stock validation for other categories
      if (!price || parseFloat(price) <= 0) {
        newErrors.price = 'Le prix est requis et doit être supérieur à 0'
      }
      if (!stock || parseInt(stock) < 0) {
        newErrors.stock = 'Le stock est requis'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    try {
      // Validate and sanitize all fields before sending
      const sanitizedName = (productName || '').trim()
      const sanitizedDescription = (description || '').trim()
      const sanitizedCategory = (category || '').trim().toLowerCase()
      const sanitizedBrand = (brand || '').trim()
      const sanitizedModel = (model || '').trim()
      const sanitizedImages = Array.isArray(images) ? images.filter(img => img && typeof img === 'string') : []
      const sanitizedSpecs = Array.isArray(specifications) ? specifications.filter(spec =>
        spec && typeof spec === 'object' && spec.label && spec.value
      ) : []

      // Build product data with validated fields
      const productData: any = {
        name: sanitizedName,
        description: sanitizedDescription,
        category: sanitizedCategory,
        brand: sanitizedBrand,
        model: sanitizedModel,
        images: sanitizedImages,
        specifications: sanitizedSpecs
      }

      if (needsVariants) {
        // Convert variants to proper format with validation
        // IMPORTANT: Ne créer un état QUE s'il a au moins une couleur valide
        const formattedVariants: any = {}
        Object.keys(variants).forEach(storage => {
          if (!variants[storage] || typeof variants[storage] !== 'object') return

          const storageVariants: any = {}
          Object.keys(variants[storage]).forEach(etat => {
            const variant = variants[storage][etat]
            if (variant && typeof variant === 'object') {
              // Validate variant fields
              const prix = typeof variant.prix === 'number' ? variant.prix : parseFloat(String(variant.prix || 0))
              const couleurs = Array.isArray(variant.couleurs) ? variant.couleurs.filter(c =>
                c && typeof c === 'object' && c.nom && c.nom.trim() && typeof c.stock === 'number'
              ).map(c => ({
                nom: c.nom.trim(),
                stock: parseInt(String(c.stock || 0))
              })) : []

              // NE PAS créer l'état s'il n'a aucune couleur valide
              if (couleurs.length > 0 && prix > 0) {
                storageVariants[etat] = {
                  prix: prix,
                  prixPublic: variant.prixPublic ? (typeof variant.prixPublic === 'number' ? variant.prixPublic : parseFloat(String(variant.prixPublic))) : undefined,
                  couleurs: couleurs
                }
              }
            }
          })

          // Ne créer le storage QUE s'il a au moins un état valide
          if (Object.keys(storageVariants).length > 0) {
            formattedVariants[storage] = storageVariants
          }
        })
        productData.variants = formattedVariants
        productData.availableStorages = Object.keys(variants).filter(s => s && s.trim())
      } else {
        // Simple pricing with validation
        const parsedPrice = parseFloat(price || '0')
        const parsedStock = parseInt(stock || '0')

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          throw new Error('Le prix doit être un nombre valide supérieur à 0')
        }
        if (isNaN(parsedStock) || parsedStock < 0) {
          throw new Error('Le stock doit être un nombre entier positif')
        }

        productData.price = parsedPrice
        productData.stock = parsedStock
      }

      // Construct API URL with validation
      const apiUrl = `${API_BASE_URL}/api/products`

      // Debug logging
      console.log('=== CREATING PRODUCT ===')
      console.log('API_BASE_URL:', API_BASE_URL)
      console.log('Full API URL:', apiUrl)
      console.log('Product Data:', JSON.stringify(productData, null, 2))

      // Validate API URL
      if (!apiUrl || apiUrl.includes('undefined') || apiUrl.includes('null')) {
        throw new Error(`Invalid API URL: ${apiUrl}. Please check your environment configuration.`)
      }

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Vous devez être connecté pour créer un produit')
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      console.log('Response status:', response.status)
      console.log('Response OK:', response.ok)

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création du produit'
        try {
          const errorData = await response.json()
          console.error('Error response:', errorData)
          errorMessage = errorData.message || errorMessage
        } catch (parseError) {
          console.error('Could not parse error response:', parseError)
          errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const createdProduct = await response.json()
      console.log('Product created successfully:', createdProduct)

      // Redirect to product list
      router.push('/admin/products')

    } catch (error: any) {
      console.error('=== ERROR CREATING PRODUCT ===')
      console.error('Error:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)

      setErrors({
        submit: error.message || 'Une erreur est survenue lors de la création du produit'
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau produit</h1>
          <p className="text-gray-600 mt-2">
            Remplissez tous les champs pour ajouter un nouveau produit au catalogue
          </p>
        </div>

        {/* Error summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Erreurs de validation</h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product selection */}
          <Card
            title="Informations de base"
            description="Sélectionnez la catégorie, la marque et le modèle"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          >
            <SmartProductSelector
              category={category}
              brand={brand}
              model={model}
              onCategoryChange={setCategory}
              onBrandChange={setBrand}
              onModelChange={setModel}
              errors={errors}
            />
          </Card>

          {/* Product details */}
          {category && brand && model && (
            <>
              <Card
                title="Détails du produit"
                description="Nom et description du produit"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                }
              >
                <div className="space-y-4">
                  {/* Affichage du nom auto-généré */}
                  {productName && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-blue-900">Nom du produit</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            <strong>{productName}</strong>
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Généré automatiquement : Marque + Modèle
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Textarea
                    label="Description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez le produit en détail..."
                    error={errors.description}
                    rows={6}
                    required
                  />
                </div>
              </Card>

              {/* Variants or simple pricing */}
              {needsVariants ? (
                <VariantsManager
                  variants={variants}
                  onChange={setVariants}
                  errors={errors}
                />
              ) : (
                <Card
                  title="Prix et stock"
                  description="Définissez le prix et la disponibilité"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Prix"
                      name="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      error={errors.price}
                      min={0}
                      step={0.01}
                      required
                    />
                    <Input
                      label="Stock"
                      name="stock"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0"
                      error={errors.stock}
                      min={0}
                      step={1}
                      required
                    />
                  </div>
                </Card>
              )}

              {/* Specifications */}
              <SpecificationsManager
                category={category}
                specifications={specifications}
                onChange={setSpecifications}
                errors={errors}
              />

              {/* Images */}
              <ImageUploader
                images={images}
                onChange={setImages}
                maxImages={10}
                errors={errors}
              />

              {/* Submit buttons */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Création en cours...' : 'Créer le produit'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/products')}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Annuler
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
