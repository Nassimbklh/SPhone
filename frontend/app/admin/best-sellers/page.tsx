'use client'

import { useEffect, useState } from 'react'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  stock: number
  isBestSeller: boolean
  bestSellerOrder: number | null
  soldCount: number
}

interface Slot {
  position: number
  product: Product | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export default function BestSellersAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedProductForSlot, setSelectedProductForSlot] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success) {
        setProducts(data.data.products)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  const addBestSellerToPosition = async (productId: string, position: number) => {
    if (!productId) {
      alert('Veuillez sélectionner un produit')
      return
    }

    try {
      setSaving(true)
      const token = localStorage.getItem('token')

      // D'abord ajouter le produit aux best sellers
      const addResponse = await fetch(`${API_URL}/products/best-sellers/add/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!addResponse.ok) {
        const data = await addResponse.json()
        alert(data.message || 'Erreur lors de l\'ajout')
        return
      }

      // Ensuite définir sa position
      const orderResponse = await fetch(`${API_URL}/products/best-sellers/order/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order: position })
      })

      const orderData = await orderResponse.json()

      if (orderResponse.ok) {
        alert(`Produit ajouté à la position ${position}`)
        setSelectedProductForSlot({ ...selectedProductForSlot, [position]: '' })
        fetchProducts()
      } else {
        alert(orderData.message || 'Erreur lors de la mise à jour de la position')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'ajout du produit')
    } finally {
      setSaving(false)
    }
  }

  const removeBestSeller = async (productId: string) => {
    try {
      setSaving(true)
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/products/best-sellers/remove/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message || 'Produit retiré des meilleures ventes')
        fetchProducts()
      } else {
        alert(data.message || 'Erreur lors du retrait')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du retrait du produit')
    } finally {
      setSaving(false)
    }
  }

  const changeOrder = async (productId: string, newOrder: number) => {
    try {
      setSaving(true)
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/products/best-sellers/order/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order: newOrder })
      })

      const data = await response.json()

      if (response.ok) {
        fetchProducts()
      } else {
        alert(data.message || 'Erreur lors de la mise à jour de l\'ordre')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise à jour de l\'ordre')
    } finally {
      setSaving(false)
    }
  }

  const bestSellers = products.filter(p => p.isBestSeller).sort((a, b) => (a.bestSellerOrder || 0) - (b.bestSellerOrder || 0))
  const availableProducts = products.filter(p => !p.isBestSeller).sort((a, b) => b.soldCount - a.soldCount)

  // Créer les 4 slots fixes
  const slots: Slot[] = [1, 2, 3, 4].map(position => {
    const product = bestSellers.find(p => p.bestSellerOrder === position) || null
    return { position, product }
  })

  if (loading) {
    return (
      <div className="max-w-6xl">
        <div className="text-center py-20">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gestion des Meilleures Ventes</h1>
        <p className="text-gray-600">
          Sélectionnez jusqu'à 4 produits à afficher en meilleures ventes sur la page d'accueil
        </p>
      </div>

      {/* Current Best Sellers - Toujours 4 positions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Produits sélectionnés ({bestSellers.length}/4)
          </h2>
          {bestSellers.length === 0 && (
            <span className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-lg">
              ⚠️ Mode automatique actif (top produits par ventes)
            </span>
          )}
          {bestSellers.length > 0 && (
            <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg">
              ✓ Mode manuel actif
            </span>
          )}
        </div>

        <div className="space-y-3">
          {slots.map((slot) => (
            <div key={slot.position}>
              {slot.product ? (
                // Slot rempli
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <select
                      value={slot.product.bestSellerOrder || slot.position}
                      onChange={(e) => changeOrder(slot.product!._id, parseInt(e.target.value))}
                      disabled={saving}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold bg-white"
                    >
                      <option value={1}>Position 1</option>
                      <option value={2}>Position 2</option>
                      <option value={3}>Position 3</option>
                      <option value={4}>Position 4</option>
                    </select>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{slot.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {slot.product.price}€ • Stock: {slot.product.stock} • Ventes: {slot.product.soldCount}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBestSeller(slot.product!._id)}
                    disabled={saving}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm disabled:opacity-50 transition-colors"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                // Slot vide
                <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold bg-white text-gray-400 min-w-[120px]">
                      Position {slot.position}
                    </div>
                    <div className="flex-1">
                      <select
                        value={selectedProductForSlot[slot.position] || ''}
                        onChange={(e) => setSelectedProductForSlot({
                          ...selectedProductForSlot,
                          [slot.position]: e.target.value
                        })}
                        disabled={saving}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="">-- Sélectionnez un produit --</option>
                        {availableProducts.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name} - {product.price}€ (Ventes: {product.soldCount})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => addBestSellerToPosition(selectedProductForSlot[slot.position], slot.position)}
                    disabled={saving || !selectedProductForSlot[slot.position]}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Products - Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Comment ça marche ?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Utilisez les dropdowns dans les positions vides pour sélectionner un produit</li>
              <li>• Cliquez sur "Ajouter" pour l'ajouter à cette position</li>
              <li>• Vous pouvez changer la position d'un produit avec le dropdown "Position X"</li>
              <li>• Les 4 positions sont toujours affichées pour une interface cohérente</li>
              <li>• {availableProducts.length} produit(s) disponible(s) pour l'ajout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
