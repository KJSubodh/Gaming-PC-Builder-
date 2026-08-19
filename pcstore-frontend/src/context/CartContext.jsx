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
      // REMOVED the null parameter - just pass token
      const items = await cartService.getCart(token)
      console.log('ITEMS RETURNED:', items)
      setCartItems(Array.isArray(items) ? items : [])
      console.log('CART STATE SET')
    } catch (error) {
      console.error('Failed to load cart:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addToCart = async (productId, quantity = 1) => {
    try {
      // REMOVED the null parameter - just pass productId, quantity, token
      await cartService.addToCart(productId, quantity, token)
      await loadCart()
      toast.success('Added to cart!')
      return true
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error(error.response?.data?.message || 'Failed to add to cart')
      return false
    }
  }

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartService.updateQuantity(cartItemId, quantity, token)
      await loadCart()
      toast.success('Cart updated')
    } catch (error) {
      console.error('Update quantity error:', error)
      toast.error('Failed to update quantity')
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId, token)
      await loadCart()
      toast.success('Removed from cart')
    } catch (error) {
      console.error('Remove from cart error:', error)
      toast.error('Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      // REMOVED the null parameter
      await cartService.clearCart(token)
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