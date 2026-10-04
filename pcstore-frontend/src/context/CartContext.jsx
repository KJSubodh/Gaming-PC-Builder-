import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartService } from '../services/cartService'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, token } = useAuth()

  const loadCart = useCallback(async () => {
    setLoading(true)
    try {
      const authToken = isAuthenticated ? token : null
      const items = await cartService.getCart(authToken)
      setCartItems(Array.isArray(items) ? items : [])
    } catch (error) {
      console.error('Failed to load cart:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addToCart = async (productId, quantity = 1) => {
    try {
      const authToken = isAuthenticated ? token : null
      await cartService.addToCart(productId, quantity, authToken)
      await loadCart()
      toast.success('Added to cart!')
      return true
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error(error.response?.data?.message || 'Failed to add to cart')
      return false
    }
  }

  // ✅ BULK ADD — adds many items, then reloads cart ONCE
  const addMultipleToCart = async (items) => {
    // items = [{ productId, quantity }, ...] OR [id1, id2, id3]
    try {
      const authToken = isAuthenticated ? token : null

      // Normalize to array of { productId, quantity }
      const normalized = items.map(item =>
        typeof item === 'object'
          ? { productId: item.productId || item.id, quantity: item.quantity || 1 }
          : { productId: item, quantity: 1 }
      )

      // Send sequentially, but only reload cart once at the end
      for (const item of normalized) {
        await cartService.addToCart(item.productId, item.quantity, authToken)
      }

      // ✅ Single cart reload
      await loadCart()

      toast.success(`${normalized.length} component${normalized.length !== 1 ? 's' : ''} added to cart!`)
      return true
    } catch (error) {
      console.error('Bulk add error:', error)
      toast.error('Failed to add some components to cart')
      // Still try to reload in case some were added
      await loadCart()
      return false
    }
  }

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const authToken = isAuthenticated ? token : null
      await cartService.updateQuantity(cartItemId, quantity, authToken)
      await loadCart()
      toast.success('Cart updated')
    } catch (error) {
      console.error('Update quantity error:', error)
      toast.error('Failed to update quantity')
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      const authToken = isAuthenticated ? token : null
      await cartService.removeFromCart(cartItemId, authToken)
      await loadCart()
      toast.success('Removed from cart')
    } catch (error) {
      console.error('Remove from cart error:', error)
      toast.error('Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      const authToken = isAuthenticated ? token : null
      await cartService.clearCart(authToken)
      setCartItems([])
      toast.success('Cart cleared')
    } catch (error) {
      console.error('Failed to clear cart:', error)
      toast.error('Failed to clear cart')
    }
  }

  const getCartTotal = useCallback(() => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cartItems])

  const getItemCount = useCallback(() => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  const value = {
    cartItems: Array.isArray(cartItems) ? cartItems : [],
    loading,
    addToCart,
    addMultipleToCart,   // ✅ expose this
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getItemCount,
    refreshCart: loadCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}