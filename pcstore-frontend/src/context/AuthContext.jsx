import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setUser(userData)
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { token, ...userData } = response
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setToken(token)
      setUser(userData)
      toast.success('Login successful!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      const { token, ...userInfo } = response
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userInfo))
      setToken(token)
      setUser(userInfo)
      toast.success('Registration successful!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}