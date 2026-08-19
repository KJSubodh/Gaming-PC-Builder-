import api from './api'

export const orderService = {
  createOrder: async (orderData, sessionId) => {
    const response = await api.post('/orders/create', orderData, {
      headers: { 'X-Session-Id': sessionId }
    })
    return response.data
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders')
    return response.data
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  getOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/orders/number/${orderNumber}`)
    return response.data
  }
}