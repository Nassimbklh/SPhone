'use client'

import { getCategoryEmoji } from '@/lib/translations'
import { getEtatLabel, getStorageLabel } from '@/lib/conditions'

interface OrderSummaryProps {
  items: any[]
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = subtotal >= 50 ? 0 : 4.99
  const total = subtotal + shipping

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>

      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={`${item._id}-${index}`}
            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">{getCategoryEmoji(item.category)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate">{item.name}</h3>
              {item.storage && (
                <p className="text-xs text-gray-500">{getStorageLabel(item.storage)}</p>
              )}
              {item.etat && (
                <p className="text-xs text-gray-500">{getEtatLabel(item.etat)}</p>
              )}
              {item.selectedColor && (
                <p className="text-xs text-gray-500">{item.selectedColor}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Qté: {item.quantity}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {(item.price * item.quantity).toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Summary */}
      <div className="space-y-3 py-4 border-t border-gray-200">
        <div className="flex justify-between text-gray-600">
          <span>Sous-total ({items.length} article{items.length > 1 ? 's' : ''})</span>
          <span className="font-semibold">{subtotal.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Livraison</span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600">Gratuite</span>
            ) : (
              `${shipping.toFixed(2)}€`
            )}
          </span>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {subtotal < 50 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-lg">🚚</span>
            <div className="flex-1">
              <p className="text-xs text-blue-900 font-medium mb-2">
                Plus que {(50 - subtotal).toFixed(2)}€ pour la livraison gratuite !
              </p>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(subtotal / 50) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="pt-4 border-t-2 border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-blue-600">{total.toFixed(2)}€</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">TVA incluse</p>
      </div>

      {/* Advantages */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Paiement 100% sécurisé</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Livraison rapide 3-5 jours</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Garantie satisfaction</span>
        </div>
      </div>
    </div>
  )
}
