import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiShield, FiEdit2, FiSave, FiX, FiLogOut, FiAlertTriangle } from 'react-icons/fi'

const Profile = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await authService.updateProfile(formData)
      toast.success('Profile updated successfully')
      setIsEditing(false)
      window.location.reload()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Same as PCBuilder */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-20 mb-8 border-b border-purple-500/10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 tracking-wider uppercase">
            <FiUser className="w-3 h-3" /> Account Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
              My Profile
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Manage your account details, view orders, and update personal information
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-lg shadow-inner">
                  {user?.name?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Welcome back!</h2>
                  <p className="text-sm text-gray-500">Manage your profile settings here</p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <FiUser className="w-3 h-3" /> Full Name
                    </label>
                    <p className="text-lg font-medium text-gray-900">{user?.name || 'Not set'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <FiMail className="w-3 h-3" /> Email Address
                    </label>
                    <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <FiPhone className="w-3 h-3" /> Phone Number
                    </label>
                    <p className="text-lg font-medium text-gray-900">{user?.phone || 'Not set'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <FiShield className="w-3 h-3" /> Account Type
                    </label>
                    <p className="text-lg font-medium">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                        user?.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user?.role || 'CUSTOMER'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 bg-red-50/30 p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-red-600 font-semibold flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4" />
                  Danger Zone
                </h3>
                <p className="text-sm text-gray-600 mt-1">Once you logout, you'll need to sign in again to access your account.</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/orders'}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiShield className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900">My Orders</h4>
            <p className="text-xs text-gray-500 mt-1">View your order history and track shipments</p>
          </button>

          <button
            onClick={() => window.location.href = '/pc-builder'}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiUser className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900">PC Builder</h4>
            <p className="text-xs text-gray-500 mt-1">Configure your custom gaming PC</p>
          </button>

          <button
            onClick={() => window.location.href = '/cart'}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiMail className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900">My Cart</h4>
            <p className="text-xs text-gray-500 mt-1">View items in your shopping cart</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile