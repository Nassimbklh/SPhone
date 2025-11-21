'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryEmoji, translateLabel } from '@/lib/translations'

interface Product {
  _id: string
  id: number
  name: string
  category: string
  price: number
  pricePublic?: number
  image?: string
  images?: string[]
  stock: number
  totalStock?: number  // Stock calculé de toutes les variantes
  variants?: any
  isBestSeller?: boolean
  soldCount?: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'manual' | 'automatic'>('automatic')

  useEffect(() => {
    fetchBestSellers()
  }, [])

  const fetchBestSellers = async () => {
    try {
      const response = await fetch(`${API_URL}/products/best-sellers/list`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.data.products)
        setMode(data.mode)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des meilleures ventes:', error)
    } finally {
      setLoading(false)
    }
  }


  const getDiscount = (product: Product) => {
    if (product.pricePublic && product.pricePublic > product.price) {
      return Math.round(((product.pricePublic - product.price) / product.pricePublic) * 100)
    }
    return null
  }

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center text-gray-600">Chargement...</div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Meilleures ventes
          </h2>
          <p className="text-gray-600">
            Les produits les plus populaires du moment
          </p>
        </div>

        {/* Products Grid - Always 4 products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((product) => {
            const discount = getDiscount(product)
            // Utiliser totalStock si disponible (pour produits avec variantes), sinon stock
            const displayStock = product.totalStock !== undefined ? product.totalStock : product.stock

            return (
              <Link
                key={product._id || product.id}
                href={`/product/${product._id || product.id}`}
                className="group block"
              >
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                    {(() => {
                      // Déterminer l'image à afficher
                      if (product.images && Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string') {
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
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                          />
                        )
                      } else {
                        return (
                          <div className="text-7xl transition-transform duration-300 group-hover:scale-110">
                            {getCategoryEmoji(product.category)}
                          </div>
                        )
                      }
                    })()}

                    {/* Best Seller Badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                      ⭐ {translateLabel('bestSeller')}
                    </div>

                    {/* Discount Badge */}
                    {discount && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white text-sm font-bold px-2.5 py-1.5 rounded-lg shadow-sm">
                        -{discount}%
                      </div>
                    )}

                    {/* Stock Badge */}
                    {displayStock < 10 && displayStock > 0 && (
                      <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                        {translateLabel('limitedStock')}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Product Name */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                        {discount ? (
                          <>
                            <span className="text-xl font-bold text-gray-900">
                              {product.price}€
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {product.pricePublic}€
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            {product.price}€
                          </span>
                        )}
                      </div>

                      {/* Stock Info */}
                      <div className="text-xs text-gray-500 mb-3">
                        {displayStock > 0 ? (
                          <span className="text-green-600 font-medium">✓ {translateLabel('inStock')}</span>
                        ) : (
                          <span className="text-red-600 font-medium">{translateLabel('outOfStock')}</span>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm">
                        {translateLabel('viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
