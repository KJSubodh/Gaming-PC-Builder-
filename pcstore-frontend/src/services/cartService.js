// cartService.js
import api from './api'

const getGuestId = () => {
  let id = localStorage.getItem('guestId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('guestId', id)
  }
  return id
}

const authHeaders = (token) =>
  token
    ? { Authorization: `Bearer ${token}` }
    : { 'X-Guest-Id': getGuestId() }

export const cartService = {
  getCart: async (token) => {
    const response = await api.get('/cart', { headers: authHeaders(token) })
    return response.data?.items || []
  },
  addToCart: async (productId, quantity, token) => {
    const response = await api.post('/cart/add', { productId, quantity }, { headers: authHeaders(token) })
    return response.data
  },
  updateQuantity: async (cartItemId, quantity, token) => {
    const response = await api.put(`/cart/update/${cartItemId}?quantity=${quantity}`, {}, { headers: authHeaders(token) })
    return response.data
  },
  removeFromCart: async (cartItemId, token) => {
    const response = await api.delete(`/cart/remove/${cartItemId}`, { headers: authHeaders(token) })
    return response.data
  },
  clearCart: async (token) => {
    const response = await api.delete('/cart/clear', { headers: authHeaders(token) })
    return response.data
  }
}