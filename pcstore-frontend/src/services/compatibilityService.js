import api from './api'

export const compatibilityService = {
  checkCompatibility: async (productIds) => {
    const response = await api.post('/compatibility/check', { productIds })
    return response.data
  },

  getCompatibleComponents: async (socket) => {
    const response = await api.get(`/compatibility/socket/${socket}/compatible`)
    return response.data
  }
}