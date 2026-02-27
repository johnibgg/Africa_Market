"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { CartItem, Listing } from "@/lib/types"

interface CartContextType {
  items: CartItem[]
  addItem: (listing: Listing, quantity?: number) => void
  removeItem: (listingId: string) => void
  updateQuantity: (listingId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((listing: Listing, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.listing.id === listing.id)
      if (existing) {
        return prev.map((item) =>
          item.listing.id === listing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { listing, quantity }]
    })
  }, [])

  const removeItem = useCallback((listingId: string) => {
    setItems((prev) => prev.filter((item) => item.listing.id !== listingId))
  }, [])

  const updateQuantity = useCallback((listingId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.listing.id !== listingId))
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.listing.id === listingId ? { ...item, quantity } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, item) => sum + item.listing.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
