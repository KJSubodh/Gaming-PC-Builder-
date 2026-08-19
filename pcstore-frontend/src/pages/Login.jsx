import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await login(email, password)
    setLoading(false)
    if (success) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Hero Section - Stacked on top for all screen sizes */}
      <div className="relative overflow-hidden bg-slate-950 border-b border-purple-500/10 py-12 px-4">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[90px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-pink-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 mb-5">
              Welcome Back Fighter
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Access Your <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Dream Rig Setup
              </span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Log in to tweak your custom compatibility specifications, review orders, and track domestic freight.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle background effect */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md bg-white/[0.02] backdrop-blur-md border border-white/[0.06] p-8 sm:p-10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-10"
        >
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">Sign In</h2>
            <p className="text-gray-400 text-sm mt-2">
              New to our marketplace?{' '}
              <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition duration-200 underline underline-offset-4">
                Create an Account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                placeholder="name@domain.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition duration-200">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:shadow-[0_4px_25px_rgba(147,51,234,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {loading ? 'Validating Link...' : 'Enter System Configuration'}
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

export default Login