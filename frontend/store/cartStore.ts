import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ConditionType, EtatType, StorageType } from '@/lib/conditions'

export interface CartItem {
  _id: string
  name: string
  price: number
  pricePublic?: number
  image?: string
  images?: string[]
  category: string
  stock: number
  quantity: number
  selectedColor?: string
  // Nouveau système de variantes
  storage?: StorageType
  etat?: EtatType
  // Ancien système (deprecated)
  condition?: ConditionType
}

interface CartStore {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (productId: string, storage?: string, etat?: EtatType, color?: string) => void
  updateQuantity: (productId: string, quantity: number, storage?: string, etat?: EtatType, color?: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1) => {
        set((state) => {
          // Un item est unique par combinaison de: id + storage + état + couleur
          const existingItem = state.items.find(item =>
            item._id === product._id &&
            item.storage === product.storage &&
            item.etat === product.etat &&
            item.selectedColor === product.selectedColor
          )

          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map(item =>
                item._id === product._id &&
                item.storage === product.storage &&
                item.etat === product.etat &&
                item.selectedColor === product.selectedColor
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                  : item
              )
            }
          }

          // Add new item
          return {
            items: [...state.items, { ...product, quantity: Math.min(quantity, product.stock) }]
          }
        })
      },

      removeFromCart: (productId, storage, etat, color) => {
        set((state) => ({
          items: state.items.filter(item =>
            !(item._id === productId &&
              item.storage === storage &&
              item.etat === etat &&
              item.selectedColor === color)
          )
        }))
      },

      updateQuantity: (productId, quantity, storage, etat, color) => {
        set((state) => ({
          items: state.items.map(item =>
            item._id === productId &&
            item.storage === storage &&
            item.etat === etat &&
            item.selectedColor === color
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
              : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
