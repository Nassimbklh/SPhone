'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { translateCategory, getCategoryEmoji } from '@/lib/translations'
import {
  // Nouveau système
  EtatType,
  StorageType,
  ProductVariants,
  ETAT_ORDER,
  STORAGE_LABELS,
  getEtatLabel,
  getEtatDescription,
  getEtatBadge,
  getStorageLabel,
  getAvailableStorages,
  getAvailableEtats,
  getCouleursForVariant,
  getVariant,
  getLowestPriceFromVariants,
  getAbsoluteLowestPrice,
  hasVariantStock,
  // Ancien système (rétrocompatibilité)
  ConditionType,
  ProductConditions,
  CONDITION_ORDER,
  getConditionLabel,
  getConditionDescription,
  getConditionBadge,
  getAvailableConditions,
  getLowestPrice,
  getColorsForCondition,
  isColorAvailableForCondition
} from '@/lib/conditions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

interface Product {
  _id: string
  name: string
  category: string
  description: string
  images?: string[]
  brand?: string
  // Nouveau système de variantes
  availableStorages?: string[]
  variants?: ProductVariants
  specifications?: {
    ecran?: Array<{ label: string; value: string }>
    processeur?: Array<{ label: string; value: string }>
    ram?: Array<{ label: string; value: string }>
    stockage?: Array<{ label: string; value: string }>
    camera?: Array<{ label: string; value: string }>
    batterie?: Array<{ label: string; value: string }>
    systeme?: Array<{ label: string; value: string }>
  }
  // Ancien système (rétrocompatibilité)
  price: number
  pricePublic?: number
  colors?: string[]
  stock: number
  conditions?: ProductConditions
  default_price?: number
  default_color?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Nouveau système de variantes
  const [selectedEtat, setSelectedEtat] = useState<EtatType | null>(null)
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')

  // Ancien système (rétrocompatibilité)
  const [selectedCondition, setSelectedCondition] = useState<ConditionType | null>(null)

  const [addedToCart, setAddedToCart] = useState(false)

  const { addToCart } = useCartStore()

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/products/${productId}`)
      const data = await response.json()

      if (data.success) {
        setProduct(data.data.product)

        // NOUVEAU SYSTÈME: Sélectionner automatiquement le premier état disponible
        if (data.data.product.variants && Object.keys(data.data.product.variants).length > 0) {
          // Filtrer pour obtenir uniquement les états qui existent dans la DB
          const existingEtats = ETAT_ORDER.filter(etat => {
            return Object.keys(data.data.product.variants).some(storage => {
              return data.data.product.variants![storage][etat] !== undefined
            })
          })

          // Trouver le premier état qui a du stock dans au moins une capacité
          let firstAvailableEtat: EtatType | null = null

          for (const etat of existingEtats) {
            // Vérifier si cet état a du stock dans au moins une capacité
            const hasStockSomewhere = Object.keys(data.data.product.variants).some(storage => {
              const variant = data.data.product.variants![storage][etat]
              // Vérifier si au moins une couleur a du stock
              return variant && Array.isArray(variant.couleurs) && variant.couleurs.some((c: any) => c && c.stock > 0)
            })

            if (hasStockSomewhere) {
              firstAvailableEtat = etat
              break
            }
          }

          if (firstAvailableEtat) {
            setSelectedEtat(firstAvailableEtat)
            // Ne pas sélectionner de stockage automatiquement - l'utilisateur doit choisir
            setSelectedStorage(null)
            setSelectedColor('')
          }
        }
        // ANCIEN SYSTÈME: conditions
        else if (data.data.product.conditions) {
          const available = getAvailableConditions(data.data.product.conditions)
          if (available.length > 0) {
            setSelectedCondition(available[0])
            const colors = getColorsForCondition(data.data.product.conditions, available[0])
            if (colors.length > 0) {
              setSelectedColor(colors[0])
            }
          }
        }
        // Mode rétrocompatibilité totale
        else {
          if (data.data.product.colors && data.data.product.colors.length > 0) {
            setSelectedColor(data.data.product.colors[0])
          }
        }
      } else {
        setError('Produit non trouvé')
      }
    } catch (err) {
      console.error('Erreur lors du chargement du produit:', err)
      setError('Erreur lors du chargement du produit')
    } finally {
      setLoading(false)
    }
  }

  // NOUVEAU SYSTÈME: Gestion des changements d'état
  const handleEtatChange = (etat: EtatType) => {
    setSelectedEtat(etat)
    setSelectedStorage(null) // Reset storage when état changes
    setSelectedColor('') // Reset color
    setQuantity(1) // Reset quantity
  }

  // NOUVEAU SYSTÈME: Gestion des changements de stockage
  const handleStorageChange = (storage: string) => {
    if (!product || !product.variants || !selectedEtat) return

    setSelectedStorage(storage)
    setQuantity(1) // Reset quantity

    // Mettre à jour la couleur sélectionnée selon les couleurs disponibles
    const availableColors = getCouleursForVariant(product.variants, storage, selectedEtat)
    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0])
    } else {
      setSelectedColor('')
    }
  }

  // ANCIEN SYSTÈME: Gestion des changements de condition
  const handleConditionChange = (condition: ConditionType) => {
    if (!product || !product.conditions) return

    setSelectedCondition(condition)
    setQuantity(1) // Reset quantity

    // Mettre à jour la couleur sélectionnée selon les couleurs disponibles pour cette condition
    const availableColors = getColorsForCondition(product.conditions, condition)
    if (availableColors.length > 0) {
      // Si la couleur actuelle n'est pas disponible, sélectionner la première disponible
      if (!availableColors.includes(selectedColor)) {
        setSelectedColor(availableColors[0])
      }
    } else {
      setSelectedColor('')
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    // NOUVEAU SYSTÈME: Avec variantes (storage + etat)
    if (product.variants && selectedStorage && selectedEtat) {
      const variant = getVariant(product.variants, selectedStorage, selectedEtat)
      if (!variant) return

      // Calculer le stock total de la couleur sélectionnée
      const selectedCouleur = variant.couleurs.find((c: any) => c.nom.toLowerCase() === selectedColor.toLowerCase())
      const stockForColor = selectedCouleur ? selectedCouleur.stock : 0

      addToCart({
        _id: product._id,
        name: product.name,
        price: variant.prix,
        pricePublic: variant.prixPublic,
        images: product.images,
        category: product.category,
        stock: stockForColor,
        storage: selectedStorage as StorageType,
        etat: selectedEtat,
        selectedColor: selectedColor || undefined
      }, quantity)
    }
    // ANCIEN SYSTÈME: Avec conditions
    else if (product.conditions && selectedCondition) {
      const conditionData = product.conditions[selectedCondition]
      if (!conditionData) return

      addToCart({
        _id: product._id,
        name: product.name,
        price: conditionData.price,
        images: product.images,
        category: product.category,
        stock: conditionData.stock,
        selectedColor: selectedColor || undefined,
        condition: selectedCondition
      }, quantity)
    }
    // Mode rétrocompatibilité totale
    else {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        pricePublic: product.pricePublic,
        images: product.images,
        category: product.category,
        stock: product.stock,
        selectedColor: selectedColor || undefined
      }, quantity)
    }

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const incrementQuantity = () => {
    if (!product) return

    let maxStock = product.stock

    // NOUVEAU SYSTÈME: variantes
    if (product.variants && selectedStorage && selectedEtat) {
      const variant = getVariant(product.variants, selectedStorage, selectedEtat)
      if (variant && selectedColor) {
        // Calculer le stock de la couleur sélectionnée
        const selectedCouleur = variant.couleurs.find((c: any) => c.nom.toLowerCase() === selectedColor.toLowerCase())
        maxStock = selectedCouleur ? selectedCouleur.stock : 0
      } else {
        maxStock = 0
      }
    }
    // ANCIEN SYSTÈME: conditions
    else if (product.conditions && selectedCondition) {
      const conditionData = product.conditions[selectedCondition]
      maxStock = conditionData?.stock || 0
    }

    if (quantity < maxStock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-8">{error || 'Ce produit n\'existe pas ou a été supprimé.'}</p>
          <Link href="/products" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Retour aux produits
          </Link>
        </div>
      </div>
    )
  }

  // Déterminer quel système utiliser avec vérifications de sécurité
  const hasVariants = product.variants && typeof product.variants === 'object' && !Array.isArray(product.variants) && Object.keys(product.variants).length > 0
  const hasConditions = !hasVariants && product.conditions && getAvailableConditions(product.conditions).length > 0

  // Fonction helper pour valider un prix (éviter les prix aberrants)
  const isValidPrice = (price: number | undefined): boolean => {
    return typeof price === 'number' && !isNaN(price) && price > 0 && price < 1000000
  }

  // Formater un prix de manière sûre
  const formatPrice = (price: number | undefined): string => {
    if (!isValidPrice(price)) {
      return 'Prix non disponible'
    }
    return `${price!.toFixed(2)}€`
  }

  // NOUVEAU SYSTÈME: Calculer les informations pour les variantes
  let currentPrice = product.price || 0
  let currentPricePublic: number | undefined = product.pricePublic
  let currentStock = product.stock || 0
  let inStock = currentStock > 0
  let availableColors: string[] = Array.isArray(product.colors) ? product.colors : []
  let canAddToCart = false
  let lowestPrice: number | null = null

  if (hasVariants && product.variants) {
    try {
      // Prix le plus bas de toutes les variantes
      lowestPrice = getLowestPriceFromVariants(product.variants)

      // Si une variante spécifique est sélectionnée (storage + etat)
      if (selectedStorage && selectedEtat) {
        const variant = getVariant(product.variants, selectedStorage, selectedEtat)
        if (variant) {
          currentPrice = variant.prix || 0
          currentPricePublic = variant.prixPublic

          // Calculer le stock total de toutes les couleurs
          currentStock = 0
          if (Array.isArray(variant.couleurs)) {
            variant.couleurs.forEach((c: any) => {
              if (c && typeof c.stock === 'number') {
                currentStock += c.stock
              }
            })
          }

          inStock = currentStock > 0
          availableColors = Array.isArray(variant.couleurs) ? variant.couleurs.map((c: any) => c.nom) : []
          canAddToCart = inStock && !!selectedColor
        }
      } else {
        // Aucune variante sélectionnée : calculer le stock total de TOUTES les variantes
        // pour déterminer si le produit est globalement en stock
        let totalStockAllVariants = 0

        Object.keys(product.variants).forEach(storage => {
          const storageData = product.variants![storage]
          if (storageData && typeof storageData === 'object') {
            Object.keys(storageData).forEach(etat => {
              const variant = storageData[etat]
              if (variant && Array.isArray(variant.couleurs)) {
                variant.couleurs.forEach((c: any) => {
                  if (c && typeof c.stock === 'number') {
                    totalStockAllVariants += c.stock
                  }
                })
              }
            })
          }
        })

        inStock = totalStockAllVariants > 0
        currentStock = totalStockAllVariants
      }
    } catch (error) {
      console.error('Erreur lors du calcul des variantes:', error)
    }
  }
  // ANCIEN SYSTÈME: Calculer les informations pour les conditions
  else if (hasConditions && product.conditions) {
    lowestPrice = getLowestPrice(product.conditions)

    if (selectedCondition) {
      const conditionData = product.conditions[selectedCondition]
      if (conditionData) {
        currentPrice = conditionData.price
        currentStock = conditionData.stock
        inStock = currentStock > 0
        availableColors = getColorsForCondition(product.conditions, selectedCondition)
        canAddToCart = inStock && !!selectedColor
      }
    }
  }
  // Mode rétrocompatibilité totale
  else {
    canAddToCart = inStock && (product.price !== undefined && product.price > 0)
  }

  // Vérifier si le produit est complètement configuré
  const isProductConfigured = hasVariants || hasConditions || (product.price !== undefined && product.price > 0)

  return (
    <div className="container-custom py-12 page-transition">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-600 animate-slide-down">
        <Link href="/" className="hover:text-blue-500 transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-500 transition-colors">
          Produits
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      {/* Message si produit non configuré */}
      {!isProductConfigured && (
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Produit non configuré</h2>
            <p className="text-gray-600 mb-4">
              Ce produit n'a pas encore été configuré avec des variantes, des prix ou du stock.
            </p>
            <p className="text-sm text-gray-500">
              Merci de compléter les informations de ce produit dans le panel admin.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Retour aux produits
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal du produit */}
      {isProductConfigured && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="animate-slide-up">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative h-96 lg:h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              {(() => {
                try {
                  if (product.images && Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string') {
                    // Construire l'URL complète de l'image
                    let imageUrl = product.images[0]
                    if (imageUrl.startsWith('http')) {
                      // URL complète, utiliser telle quelle
                      imageUrl = imageUrl
                    } else if (imageUrl.startsWith('/')) {
                      // Chemin relatif commençant par /, préfixer avec l'URL de l'API
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
                      imageUrl = `${apiUrl}${imageUrl}`
                    } else {
                      // Nom de fichier seul, construire le chemin complet
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
                      imageUrl = `${apiUrl}/uploads/${imageUrl}`
                    }

                    return (
                      <Image
                        src={imageUrl}
                        alt={product.name || 'Produit'}
                        fill
                        className="object-contain p-8"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized={true}
                        onError={(e) => {
                          console.error('Error loading image:', imageUrl)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )
                  } else {
                    return <div className="text-9xl">{getCategoryEmoji(product.category)}</div>
                  }
                } catch (error) {
                  console.error('Error rendering main image:', error)
                  return <div className="text-9xl">{getCategoryEmoji(product.category)}</div>
                }
              })()}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {(() => {
            try {
              if (!product.images || !Array.isArray(product.images) || product.images.length <= 1) {
                return null
              }

              const validImages = product.images.filter(img => img && typeof img === 'string').slice(0, 4)
              if (validImages.length === 0) return null

              return (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {validImages.map((img, index) => {
                    try {
                      // Construire l'URL complète de l'image
                      let imageUrl = img
                      if (imageUrl.startsWith('http')) {
                        // URL complète, utiliser telle quelle
                        imageUrl = imageUrl
                      } else if (imageUrl.startsWith('/')) {
                        // Chemin relatif commençant par /, préfixer avec l'URL de l'API
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
                        imageUrl = `${apiUrl}${imageUrl}`
                      } else {
                        // Nom de fichier seul, construire le chemin complet
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
                        imageUrl = `${apiUrl}/uploads/${imageUrl}`
                      }

                      return (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all h-24 overflow-hidden relative"
                        >
                          <Image
                            src={imageUrl}
                            alt={`${product.name || 'Produit'} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="120px"
                            unoptimized={true}
                          />
                        </div>
                      )
                    } catch (error) {
                      console.error(`Error rendering thumbnail ${index}:`, error)
                      return null
                    }
                  })}
                </div>
              )
            } catch (error) {
              console.error('Error rendering thumbnail gallery:', error)
              return null
            }
          })()}
        </div>

        {/* Product Info */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Category Badge */}
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
            {translateCategory(product.category)}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Brand */}
          {product.brand && (
            <p className="text-gray-600 mb-4">Marque: <span className="font-semibold">{product.brand}</span></p>
          )}

          {/* Price Display */}
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            {(hasVariants || hasConditions) && lowestPrice !== null ? (
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm text-gray-600">À partir de</span>
                  <span className="text-4xl font-bold text-gray-900">{lowestPrice}€</span>
                </div>
                {(selectedStorage && selectedEtat) || selectedCondition ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Prix sélectionné:</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {isValidPrice(currentPrice) ? (
                        <>
                          <p className="text-3xl font-bold text-blue-600">{formatPrice(currentPrice)}</p>
                          {isValidPrice(currentPricePublic) && currentPricePublic! > currentPrice && (
                            <>
                              <span className="text-lg text-gray-400 line-through">
                                {formatPrice(currentPricePublic)}
                              </span>
                              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-lg">
                                -{Math.round(((currentPricePublic! - currentPrice) / currentPricePublic!) * 100)}%
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <p className="text-lg text-gray-500">Prix non disponible</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {isValidPrice(product.price) ? (
                  <>
                    <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                    {isValidPrice(product.pricePublic) && product.pricePublic! > product.price && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(product.pricePublic)}
                        </span>
                        <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg">
                          -{Math.round(((product.pricePublic! - product.price) / product.pricePublic!) * 100)}%
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-lg text-gray-500">Prix non disponible</span>
                )}
              </div>
            )}
          </div>

          {/* Stock Indicator - JAMAIS afficher le nombre exact */}
          <div className="mb-6 flex items-center gap-2">
            {inStock ? (
              <>
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-green-600">En stock</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-medium text-red-600">Rupture de stock</span>
              </>
            )}
          </div>

          {/* NOUVEAU SYSTÈME: Sélection des Variantes */}
          {hasVariants && product.variants && (
            <>
              {/* 1️⃣ Sélection de l'État */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">Choisissez l'état</h3>
                <div className="space-y-3">
                  {ETAT_ORDER.filter(etatKey => {
                    // FILTRE: Ne montrer que les états qui existent dans au moins un storage
                    try {
                      if (!product.variants || typeof product.variants !== 'object') return false
                      const storageKeys = Object.keys(product.variants)
                      if (!Array.isArray(storageKeys) || storageKeys.length === 0) return false

                      return storageKeys.some(storage => {
                        try {
                          const storageData = product.variants?.[storage]
                          if (!storageData || typeof storageData !== 'object') return false
                          // L'état doit exister (pas undefined) dans au moins un storage
                          return storageData[etatKey] !== undefined
                        } catch {
                          return false
                        }
                      })
                    } catch {
                      return false
                    }
                  }).map((etatKey) => {
                    try {
                      // Vérifier si cet état a du stock dans au moins une capacité
                      const hasStockSomewhere = (() => {
                        try {
                          if (!product.variants || typeof product.variants !== 'object') return false
                          const storageKeys = Object.keys(product.variants)
                          if (!Array.isArray(storageKeys) || storageKeys.length === 0) return false

                          return storageKeys.some(storage => {
                            try {
                              const storageData = product.variants?.[storage]
                              if (!storageData || typeof storageData !== 'object') return false
                              const variant = storageData[etatKey]
                              // Vérifier si au moins une couleur a du stock
                              return variant && typeof variant === 'object' &&
                                Array.isArray(variant.couleurs) &&
                                variant.couleurs.some((c: any) => c && c.stock > 0)
                            } catch {
                              return false
                            }
                          })
                        } catch {
                          return false
                        }
                      })()

                      const isSelected = selectedEtat === etatKey
                      const badge = getEtatBadge(etatKey)

                      // Calculer le prix le plus bas pour cet état et le prix public correspondant
                      let lowestPriceForEtat: number | null = null
                      let lowestPrixPublicForEtat: number | null = null

                      try {
                        if (product.variants && typeof product.variants === 'object') {
                          const storageKeys = Object.keys(product.variants)
                          if (Array.isArray(storageKeys)) {
                            storageKeys.forEach(storage => {
                              try {
                                const storageData = product.variants?.[storage]
                                if (!storageData || typeof storageData !== 'object') return
                                const variant = storageData[etatKey]
                                // Vérifier si au moins une couleur a du stock
                                const hasStock = variant && typeof variant === 'object' &&
                                  Array.isArray(variant.couleurs) &&
                                  variant.couleurs.some((c: any) => c && c.stock > 0)

                                if (hasStock && typeof variant.prix === 'number') {
                                  if (lowestPriceForEtat === null || variant.prix < lowestPriceForEtat) {
                                    lowestPriceForEtat = variant.prix
                                    lowestPrixPublicForEtat = (typeof variant.prixPublic === 'number' ? variant.prixPublic : null)
                                  }
                                }
                              } catch {
                                // Skip this storage on error
                              }
                            })
                          }
                        }
                      } catch {
                        lowestPriceForEtat = null
                        lowestPrixPublicForEtat = null
                      }

                      // Calculer la réduction
                      const discountPercent = (() => {
                        try {
                          if (lowestPrixPublicForEtat && lowestPriceForEtat && lowestPrixPublicForEtat > lowestPriceForEtat) {
                            return Math.round(((lowestPrixPublicForEtat - lowestPriceForEtat) / lowestPrixPublicForEtat) * 100)
                          }
                          return null
                        } catch {
                          return null
                        }
                      })()

                      return (
                        <button
                          key={etatKey}
                          onClick={() => hasStockSomewhere && handleEtatChange(etatKey)}
                          disabled={!hasStockSomewhere}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : hasStockSomewhere
                              ? 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-sm'
                              : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`font-semibold ${hasStockSomewhere ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {getEtatLabel(etatKey)}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}>
                                  {badge.label}
                                </span>
                                {discountPercent && hasStockSomewhere && (
                                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-lg">
                                    -{discountPercent}%
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm mb-2 ${hasStockSomewhere ? 'text-gray-600' : 'text-gray-400'}`}>
                                {getEtatDescription(etatKey)}
                              </p>
                              {lowestPriceForEtat !== null && typeof lowestPriceForEtat === 'number' && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`font-bold text-lg ${hasStockSomewhere ? 'text-gray-900' : 'text-gray-400'}`}>
                                    À partir de {lowestPriceForEtat.toFixed(2)}€
                                  </span>
                                  {lowestPrixPublicForEtat && typeof lowestPrixPublicForEtat === 'number' && lowestPrixPublicForEtat > lowestPriceForEtat && hasStockSomewhere && (
                                    <span className="text-sm text-gray-400 line-through">
                                      {lowestPrixPublicForEtat.toFixed(2)}€
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <div className="ml-4">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    } catch (error) {
                      // If any error occurs while rendering this state option, skip it
                      console.error(`Error rendering état ${etatKey}:`, error)
                      return null
                    }
                  })}
                </div>
              </div>

              {/* 2️⃣ Sélection du Stockage */}
              {selectedEtat && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">Choisissez la capacité</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(() => {
                      try {
                        const availableStorages = getAvailableStorages(product.variants) || []
                        if (!Array.isArray(availableStorages) || availableStorages.length === 0) {
                          return (
                            <div className="col-span-full text-center py-4 text-gray-500">
                              Aucune capacité disponible pour cet état
                            </div>
                          )
                        }

                        return availableStorages.map((storage) => {
                          try {
                            const hasStock = product.variants ? hasVariantStock(product.variants, storage, selectedEtat) : false
                            const isSelected = selectedStorage === storage
                            const variant = product.variants ? getVariant(product.variants, storage, selectedEtat) : null

                            return (
                              <button
                                key={storage}
                                onClick={() => hasStock && handleStorageChange(storage)}
                                disabled={!hasStock}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : hasStock
                                    ? 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-sm'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                }`}
                              >
                                <div className="text-center">
                                  <p className={`font-bold text-lg mb-1 ${hasStock ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {getStorageLabel(storage)}
                                  </p>
                                  {variant && hasStock && typeof variant.prix === 'number' && (
                                    <p className="text-sm font-semibold text-blue-600">{variant.prix.toFixed(2)}€</p>
                                  )}
                                </div>
                              </button>
                            )
                          } catch (error) {
                            console.error(`Error rendering storage ${storage}:`, error)
                            return null
                          }
                        })
                      } catch (error) {
                        console.error('Error rendering storage selection:', error)
                        return (
                          <div className="col-span-full text-center py-4 text-red-500">
                            Erreur lors du chargement des capacités
                          </div>
                        )
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* 3️⃣ Sélection de la Couleur */}
              {selectedEtat && selectedStorage && Array.isArray(availableColors) && availableColors.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">
                    Choisissez la couleur {selectedColor && typeof selectedColor === 'string' && `: ${selectedColor}`}
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {availableColors.map((color) => {
                      try {
                        if (!color || typeof color !== 'string') return null

                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                              selectedColor === color
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                                : 'border-gray-300 bg-white hover:border-blue-300'
                            }`}
                          >
                            {color}
                          </button>
                        )
                      } catch (error) {
                        console.error(`Error rendering color ${color}:`, error)
                        return null
                      }
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ANCIEN SYSTÈME: Sélection des Conditions */}
          {hasConditions && product.conditions && (
            <>
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">Choisissez l'état</h3>
                <div className="space-y-3">
                  {CONDITION_ORDER.map((conditionKey) => {
                    try {
                      const condition = product.conditions![conditionKey]
                      if (!condition || typeof condition !== 'object') return null

                      const isAvailable = typeof condition.stock === 'number' && condition.stock > 0
                      const isSelected = selectedCondition === conditionKey
                      const badge = getConditionBadge(conditionKey)

                      return (
                        <button
                          key={conditionKey}
                          onClick={() => isAvailable && handleConditionChange(conditionKey)}
                          disabled={!isAvailable}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : isAvailable
                              ? 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-sm'
                              : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-semibold ${isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {getConditionLabel(conditionKey)}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}>
                                  {badge.label}
                                </span>
                              </div>
                              <p className={`text-sm mb-2 ${isAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
                                {getConditionDescription(conditionKey)}
                              </p>
                              {typeof condition.price === 'number' && (
                                <div className="text-sm">
                                  <span className={`font-bold ${isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {condition.price.toFixed(2)}€
                                  </span>
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <div className="ml-4">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    } catch (error) {
                      console.error(`Error rendering condition ${conditionKey}:`, error)
                      return null
                    }
                  })}
                </div>
              </div>

              {/* Couleurs pour l'ancien système */}
              {Array.isArray(availableColors) && availableColors.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">
                    Couleur {selectedColor && typeof selectedColor === 'string' && `: ${selectedColor}`}
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {availableColors.map((color) => {
                      try {
                        if (!color || typeof color !== 'string') return null

                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                              selectedColor === color
                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                                : 'border-gray-300 bg-white hover:border-blue-300'
                            }`}
                          >
                            {color}
                          </button>
                        )
                      } catch (error) {
                        console.error(`Error rendering color ${color}:`, error)
                        return null
                      }
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Quantity Selector */}
          {inStock && (
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Quantité</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= currentStock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`flex-1 py-4 text-lg font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : canAddToCart
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {addedToCart ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ajouté au panier !
                </>
              ) : (
                <>
                  🛒 Ajouter au panier - {(currentPrice * quantity).toFixed(2)}€
                </>
              )}
            </button>
            <Link
              href="/cart"
              className="border-2 border-gray-300 py-4 px-6 text-center rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Voir le panier
            </Link>
          </div>

          {/* Validation messages - seulement si en stock */}
          {!canAddToCart && inStock && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                {hasVariants && !selectedEtat && '⚠️ Veuillez sélectionner un état'}
                {hasVariants && selectedEtat && !selectedStorage && '⚠️ Veuillez sélectionner une capacité'}
                {hasVariants && selectedEtat && selectedStorage && !selectedColor && availableColors.length > 0 && '⚠️ Veuillez sélectionner une couleur'}
                {hasConditions && !selectedCondition && '⚠️ Veuillez sélectionner un état'}
                {hasConditions && selectedCondition && !selectedColor && availableColors.length > 0 && '⚠️ Veuillez sélectionner une couleur'}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {(() => {
            try {
              if (!product.specifications || typeof product.specifications !== 'object' || Array.isArray(product.specifications)) {
                return null
              }

              const specEntries = Object.entries(product.specifications)
              if (specEntries.length === 0) return null

              // Filter valid spec categories
              const validSpecs = specEntries.filter(([_, specs]) => {
                return specs && Array.isArray(specs) && specs.length > 0
              })

              if (validSpecs.length === 0) return null

              return (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-bold text-lg mb-4">Spécifications techniques</h3>
                  <div className="space-y-4">
                    {validSpecs.map(([categoryKey, specs]) => {
                      try {
                        if (!Array.isArray(specs) || specs.length === 0) return null

                        // Filter valid specs
                        const validSpecItems = specs.filter(spec =>
                          spec &&
                          typeof spec === 'object' &&
                          (spec.label || spec.value)
                        )

                        if (validSpecItems.length === 0) return null

                        return (
                          <div key={categoryKey} className="border-b border-gray-200 pb-3 last:border-0">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 capitalize">
                              {categoryKey === 'ecran' ? 'Écran' :
                               categoryKey === 'processeur' ? 'Processeur' :
                               categoryKey === 'camera' ? 'Caméra' :
                               categoryKey === 'batterie' ? 'Batterie' :
                               categoryKey === 'systeme' ? 'Système' :
                               categoryKey}
                            </h4>
                            <div className="space-y-1">
                              {validSpecItems.map((spec, index) => {
                                try {
                                  return (
                                    <div key={index} className="flex justify-between text-sm">
                                      <span className="text-gray-600">{spec.label || ''}</span>
                                      <span className="font-semibold text-gray-900">{spec.value || ''}</span>
                                    </div>
                                  )
                                } catch (error) {
                                  console.error(`Error rendering spec item ${index}:`, error)
                                  return null
                                }
                              })}
                            </div>
                          </div>
                        )
                      } catch (error) {
                        console.error(`Error rendering spec category ${categoryKey}:`, error)
                        return null
                      }
                    })}
                  </div>
                </div>
              )
            } catch (error) {
              console.error('Error rendering specifications:', error)
              return null
            }
          })()}
        </div>
      </div>
      )}

      {/* Continue Shopping - toujours affiché */}
      {isProductConfigured && (
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            ← Continuer mes achats
          </Link>
        </div>
      )}
    </div>
  )
}
