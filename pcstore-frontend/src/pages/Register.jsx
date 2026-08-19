import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    const success = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    })
    setLoading(false)
    
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Hero Section - Stacked on top for all screen sizes */}
      <div className="relative overflow-hidden bg-slate-950 border-b border-purple-500/10 py-12 px-4">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[90px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 mb-5">
              Forge Your Account Profile
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Join the Next Gen <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Building Alliance
              </span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Unlock our direct custom smart compatibility builder engine, custom loops parameters, and dedicated tier tech support teams.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle background effect */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] p-8 sm:p-10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-10"
        >
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
            <p className="text-gray-400 text-sm mt-2">
              Already have an active profile?{' '}
              <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition duration-200 underline underline-offset-4">
                Sign In Instead
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Split row for Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                  placeholder="Alex"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                  placeholder="Thompson"
                />
              </div>
            </div>

            {/* Split row for Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                  placeholder="name@domain.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Split row for Password fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                  placeholder="••••••••"
                />
                <p className="text-[10px] font-medium text-gray-500 mt-1">Minimum length: 6 tokens</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:shadow-[0_4px_25px_rgba(147,51,234,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4"
            >
              {loading ? 'Compiling Account Manifest...' : 'Initialize Alliance Credentials'}
            </button>
          </form>

          {/* Footer Text for Mobile */}
          <div className="mt-8 text-center text-xs text-gray-500 lg:hidden">
            Premium Telemetry & Hardware Systems Line India &copy; {new Date().getFullYear()}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register