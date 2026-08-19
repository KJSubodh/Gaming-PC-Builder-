import api from './api'

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await api.post(`/auth/forgot-password?email=${email}`)
    return response.data
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password?token=${token}&newPassword=${newPassword}`)
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  }
}