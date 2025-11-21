'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { translateCategory, getCategoryEmoji } from '@/lib/translations'

// Fonction pour calculer le prix le plus bas d'un produit
const getLowestPrice = (product: any): number => {
  // Si le produit a des variants
  if (product.variants && typeof product.variants === 'object') {
    let lowestPrice = Infinity

    Object.keys(product.variants).forEach(storage => {
      const storageVariants = product.variants[storage]
      if (storageVariants && typeof storageVariants === 'object') {
        Object.keys(storageVariants).forEach(etat => {
          const variant = storageVariants[etat]
          if (variant && typeof variant.prix === 'number' && variant.prix > 0) {
            if (variant.prix < lowestPrice) {
              lowestPrice = variant.prix
            }
          }
        })
      }
    })

    return lowestPrice === Infinity ? product.price || 0 : lowestPrice
  }

  // Sinon retourner le prix simple
  return product.price || 0
}

// Fonction pour calculer le stock total d'un produit
const getTotalStock = (product: any): number => {
  // Si le produit a des variants
  if (product.variants && typeof product.variants === 'object') {
    let totalStock = 0

    Object.keys(product.variants).forEach(storage => {
      const storageVariants = product.variants[storage]
      if (storageVariants && typeof storageVariants === 'object') {
        Object.keys(storageVariants).forEach(etat => {
          const variant = storageVariants[etat]
          if (variant && Array.isArray(variant.couleurs)) {
            variant.couleurs.forEach((couleur: any) => {
              if (couleur && typeof couleur.stock === 'number') {
                totalStock += couleur.stock
              }
            })
          }
        })
      }
    })

    return totalStock
  }

  // Sinon retourner le stock simple
  return product.stock || 0
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products')
      const data = await response.json()
      setProducts(data.data?.products || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        alert('Produit supprime avec succes')
        fetchProducts()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
        <Link href="/admin/products/create" className="btn-primary">
          Ajouter un produit
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Prix</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Categorie</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                    Aucun produit trouve
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-3xl">
                        {getCategoryEmoji(product.category)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4">
                      {(() => {
                        const lowestPrice = getLowestPrice(product)
                        const hasVariants = product.variants && Object.keys(product.variants).length > 0

                        return (
                          <div>
                            <span className="font-bold text-gray-900">
                              {hasVariants && 'À partir de '}
                              {lowestPrice.toFixed(2)}€
                            </span>
                          </div>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const totalStock = getTotalStock(product)
                        return (
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            totalStock > 10 ? 'bg-green-100 text-green-600' :
                            totalStock > 0 ? 'bg-orange-100 text-orange-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {totalStock}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-700">{translateCategory(product.category)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product._id}`} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                          Modifier
                        </Link>
                        <button onClick={() => handleDelete(product._id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-gray-600">
          Total: <span className="font-bold text-gray-900">{filteredProducts.length}</span> produit(s)
        </p>
      </div>
    </div>
  )
}
