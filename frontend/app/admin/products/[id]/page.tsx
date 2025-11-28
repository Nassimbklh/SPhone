'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
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
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

interface FormErrors {
  [key: string]: string
}

interface Specification {
  label: string
  value: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { token, user } = useAuthStore()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Basic information
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [name, setName] = useState('')
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

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiUrl = `${API_URL}/products/${productId}`
        console.log('Fetching product from:', apiUrl)

        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error('Produit non trouvé')
        }

        const data = await response.json()
        const product = data.data?.product || data

        // Basic info
        setCategory(product.category || '')
        setBrand(product.brand || '')
        setModel(product.model || '')
        setName(product.name || '')
        setDescription(product.description || '')
        setImages(product.images || [])

        // Specifications - convert from old format if needed
        if (product.specifications) {
          if (Array.isArray(product.specifications)) {
            setSpecifications(product.specifications)
          } else if (typeof product.specifications === 'object') {
            // Convert from categorized format to flat array
            const specs: Specification[] = []
            Object.values(product.specifications).forEach((categorySpecs: any) => {
              if (Array.isArray(categorySpecs)) {
                specs.push(...categorySpecs)
              }
            })
            setSpecifications(specs)
          }
        }

        // Variants or simple pricing
        if (product.variants && Object.keys(product.variants).length > 0) {
          // New format with variants
          const formattedVariants: ProductVariants = {}

          Object.entries(product.variants).forEach(([storage, storageData]: [string, any]) => {
            formattedVariants[storage] = {}

            Object.entries(storageData).forEach(([etat, variant]: [string, any]) => {
              if (variant && typeof variant === 'object') {
                formattedVariants[storage][etat] = {
                  prix: variant.prix || 0,
                  prixPublic: variant.prixPublic,
                  couleurs: variant.couleurs || []
                }
              }
            })
          })

          setVariants(formattedVariants)
        } else {
          // Old format with simple price/stock
          setPrice(product.price?.toString() || '')
          setStock(product.stock?.toString() || '')
        }

      } catch (error: any) {
        console.error('Error fetching product:', error)
        setErrors({ fetch: error.message || 'Erreur lors du chargement du produit' })
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Basic fields
    if (!category) newErrors.category = 'La catégorie est requise'
    if (!brand) newErrors.brand = 'La marque est requise'
    if (!model) newErrors.model = 'Le modèle est requis'
    if (!name.trim()) newErrors.name = 'Le nom du produit est requis'
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
      const productData: any = {
        name,
        description,
        category,
        brand,
        model,
        images,
        specifications
      }

      if (needsVariants) {
        // Convert variants to proper format
        // IMPORTANT: Ne créer un état QUE s'il a au moins une couleur valide
        const formattedVariants: any = {}
        Object.keys(variants).forEach(storage => {
          const storageVariants: any = {}
          Object.keys(variants[storage]).forEach(etat => {
            const variant = variants[storage][etat]
            if (variant) {
              // Formatter les couleurs avec validation
              const couleursFormatted = Array.isArray(variant.couleurs) ? variant.couleurs.filter((c: any) =>
                c && typeof c === 'object' && c.nom && c.nom.trim() && typeof c.stock === 'number'
              ).map((c: any) => ({
                nom: c.nom.trim(),
                stock: parseInt(String(c.stock || 0))
              })) : []

              // NE PAS créer l'état s'il n'a aucune couleur valide
              if (couleursFormatted.length > 0 && variant.prix > 0) {
                storageVariants[etat] = {
                  prix: variant.prix,
                  prixPublic: variant.prixPublic || undefined,
                  couleurs: couleursFormatted
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
        productData.availableStorages = Object.keys(formattedVariants)
      } else {
        // Simple pricing
        productData.price = parseFloat(price)
        productData.stock = parseInt(stock)
      }

      // Construct API URL with validation
      const apiUrl = `${API_URL}/products/${productId}`

      // Debug logging
      console.log('=== UPDATING PRODUCT ===')
      console.log('Product ID:', productId)
      console.log('API_URL:', API_URL)
      console.log('Full API URL:', apiUrl)
      console.log('Product Data:', JSON.stringify(productData, null, 2))

      // Validate API URL
      if (!apiUrl || apiUrl.includes('undefined') || apiUrl.includes('null')) {
        throw new Error(`Invalid API URL: ${apiUrl}. Please check your environment configuration.`)
      }

      if (!token) {
        throw new Error('Vous devez être connecté pour modifier un produit')
      }

      if (user?.role !== 'admin') {
        throw new Error('Vous devez être administrateur pour modifier un produit')
      }

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      console.log('Response status:', response.status)
      console.log('Response OK:', response.ok)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }))
        console.error('Error response:', errorData)
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du produit')
      }

      const updatedProduct = await response.json()
      console.log('Product updated successfully:', updatedProduct)

      // Redirect to product page or admin list
      router.push(`/admin/products`)

    } catch (error: any) {
      console.error('=== ERROR UPDATING PRODUCT ===')
      console.error('Error:', error)
      console.error('Error message:', error.message)
      setErrors({ submit: error.message || 'Une erreur est survenue lors de la mise à jour' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{errors.fetch}</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modifier le produit</h1>
          <p className="text-gray-600 mt-2">
            Mettez à jour les informations du produit
          </p>
        </div>

        {/* Error summary */}
        {Object.keys(errors).length > 0 && !errors.fetch && (
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
            description="Catégorie, marque et modèle du produit"
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
              <Input
                label="Nom du produit"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: iPhone 15 Pro Max - Reconditionné"
                error={errors.name}
                required
              />
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
              {isSubmitting ? 'Mise à jour en cours...' : 'Mettre à jour le produit'}
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
        </form>
      </div>
    </div>
  )
}
