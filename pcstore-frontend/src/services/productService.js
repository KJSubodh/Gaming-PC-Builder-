// productService.js - Fallback version without backend change

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

  // Get products by multiple categories using client-side filtering
  getProductsByCategories: async (categories) => {
    try {
      // First try: Check if backend supports it
      const categoriesParam = categories.join(',')
      const response = await api.get(`/products/categories?categories=${categoriesParam}`)
      return response.data
    } catch (error) {
      // Fallback: Fetch all products and filter
      console.log('Using fallback: filtering products client-side')
      const allProducts = await productService.getAllProducts()
      return allProducts.filter(p => categories.includes(p.category))
    }
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