import api from './api'

export const cartService = {
  getCart: async (token) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await api.get('/cart', { headers })
      console.log('CART RAW RESPONSE:', response.data)
      // Backend returns CartResponse { items, totalAmount, itemCount }
      return response.data?.items || []
    } catch (error) {
      console.error('Error getting cart:', error)
      return []
    }
  },

  addToCart: async (productId, quantity, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await api.post('/cart/add', {
      productId,
      quantity
    }, { headers })
    return response.data
  },

  updateQuantity: async (cartItemId, quantity, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await api.put(`/cart/update/${cartItemId}?quantity=${quantity}`, {}, { headers })
    return response.data
  },

  removeFromCart: async (cartItemId, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await api.delete(`/cart/remove/${cartItemId}`, { headers })
    return response.data
  },

  clearCart: async (token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await api.delete('/cart/clear', { headers })
    return response.data
  }
}