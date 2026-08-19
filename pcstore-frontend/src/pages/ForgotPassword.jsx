import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiMail, FiLock } from 'react-icons/fi'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSubmitted(true)
      toast.success('Password reset email sent!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Hero Section - Same as Login/Register */}
      <div className="relative overflow-hidden bg-slate-950 border-b border-purple-500/10 py-12 px-4">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[90px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 mb-5">
              Account Recovery
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Forgot Your <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Password?
              </span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Don't worry, we'll send you a secure link to reset your password and get you back into your account.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle background effect */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md bg-white/[0.02] backdrop-blur-md border border-white/[0.06] p-8 sm:p-10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-10"
          >
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                <FiLock className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
              <p className="text-gray-400 text-sm mt-2">
                Enter your email address and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:shadow-[0_4px_25px_rgba(147,51,234,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition duration-200">
                <FiArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white/[0.02] backdrop-blur-md border border-white/[0.06] p-8 sm:p-10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-10 text-center"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <span className="text-3xl text-green-400">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We've sent a password reset link to <span className="text-purple-400 font-medium">{email}</span>
            </p>
            <p className="text-gray-500 text-xs mt-3">The link will expire in 1 hour</p>
            <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition duration-200">
              <FiArrowLeft className="w-4 h-4" /> Return to Login
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword