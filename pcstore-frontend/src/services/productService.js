import api from './api'

export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/products')
    return response.data
  },

  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`)
    return response.data
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  searchProducts: async (query) => {
    const response = await api.get(`/products/search?q=${query}`)
    return response.data
  },

  getLatestProducts: async (limit = 8) => {
    const response = await api.get(`/products/latest?limit=${limit}`)
    return response.data
  },

  checkCompatibility: async (productIds) => {
    const response = await api.post('/compatibility/check', { productIds })
    return response.data
  }
}