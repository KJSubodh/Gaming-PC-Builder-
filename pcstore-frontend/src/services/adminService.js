import api from './api'

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },

  getAllProducts: async () => {
    const response = await api.get('/admin/products')
    return response.data
  },

  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData)
    return response.data
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/admin/products/${id}`, productData)
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`)
    return response.data
  },

  getAllOrders: async () => {
    const response = await api.get('/admin/orders')
    return response.data
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/admin/orders/${id}/status?status=${status}`)
    return response.data
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users')
    return response.data
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role?role=${role}`)
    return response.data
  }
}