'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        
        // Fetch products
        const productsRes = await fetch('http://localhost:5001/api/products')
        const productsData = await productsRes.json()
        
        // Fetch orders
        const ordersRes = await fetch('http://localhost:5001/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const ordersData = await ordersRes.json()
        
        const orders = ordersData.data?.orders || []
        
        setStats({
          totalProducts: productsData.data?.products?.length || 0,
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
          paidOrders: orders.filter((o: any) => o.status === 'paid').length
        })
        
        setRecentOrders(orders.slice(0, 5))
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Chargement...</div>
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Produits</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Commandes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl">🛍️</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Payees</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{stats.paidOrders}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/products/create" className="btn-primary text-center py-4">
            ➕ Ajouter un produit
          </Link>
          <Link href="/admin/products" className="bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-center py-4 font-medium">
            📦 Voir tous les produits
          </Link>
          <Link href="/admin/orders" className="bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-center py-4 font-medium">
            🛍️ Voir les commandes
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Dernieres commandes</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-600">Aucune commande</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <Link key={order._id} href={`/admin/orders/${order._id}`} className="block p-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Commande #{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{order.user?.name || 'Utilisateur'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{order.totalAmount}€</p>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                      order.status === 'paid' ? 'bg-green-100 text-green-600' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
