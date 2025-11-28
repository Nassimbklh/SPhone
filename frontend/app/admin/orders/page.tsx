'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      // Filtrer pour ne garder QUE les commandes payées
      const allOrders = data.data?.orders || []
      const paidOrders = allOrders.filter((order: any) =>
        order.paymentStatus === 'paid' || order.status === 'paid'
      )

      setOrders(paidOrders)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-orange-100 text-orange-600'
      case 'paid': return 'bg-green-100 text-green-600'
      case 'shipped': return 'bg-blue-100 text-blue-600'
      case 'delivered': return 'bg-purple-100 text-purple-600'
      case 'cancelled': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return <div className="text-center py-20">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Commandes Payées</h1>
        <div className="text-gray-600">
          Total: <span className="font-bold text-green-600">{orders.length}</span> commande(s) payée(s)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <input
            type="text"
            placeholder="Rechercher par ID, email ou nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les commandes payées</option>
            <option value="paid">Payée (en attente d'expédition)</option>
            <option value="shipped">Expediee</option>
            <option value="delivered">Livree</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">ID Commande</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Client</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Montant</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucune commande trouvee
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">#{order._id.slice(-8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{order.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-600">{order.totalAmount}€</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Voir details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-700">{orders.length}</div>
            <div className="text-sm text-gray-500">Total payées</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'paid').length}</div>
            <div className="text-sm text-gray-500">À expédier</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'shipped').length}</div>
            <div className="text-sm text-gray-500">Expediees</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'delivered').length}</div>
            <div className="text-sm text-gray-500">Livrees</div>
          </div>
        </div>
      </div>
    </div>
  )
}
