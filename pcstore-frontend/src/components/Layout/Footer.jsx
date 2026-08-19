import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  FiMail, FiPhone, FiMapPin, FiHeart, FiTrendingUp,
  FiShield, FiTruck, FiRefreshCw, FiCreditCard, FiSend
} from 'react-icons/fi'
import { useRef } from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
      setEmail('')
    }
  }

  const footerLinks = {
    shop: [
      { name: 'All Products', path: '/products' },
      { name: 'PC Builder', path: '/pc-builder' },
      { name: 'Accessories', path: '/accessories' },
      { name: 'Pre-Built PCs', path: '/pre-built' },
    ],
    support: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Shipping Info', path: '/shipping' },
      { name: 'Returns Policy', path: '/returns' },
    ],
  }

  const features = [
    { icon: FiTruck, title: 'Fast Delivery', desc: 'Secure nationwide shipping' },
    { icon: FiShield, title: 'Genuine Warranty', desc: '100% certified hardware' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: 'Hassle-free 7-day policy' },
    { icon: FiCreditCard, title: 'Secure Payment', desc: 'Encrypted transactions' },
  ]

  return (
    <footer ref={ref} className="relative bg-slate-950 text-white border-t border-white/5 overflow-hidden">
      {/* Background Ambient Accents */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-12 right-1/4 w-[300px] h-[300px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Value Proposition Badges */}
      <div className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-center gap-4 group"
              >
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:border-purple-500/40 group-hover:bg-purple-500/5 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-wide uppercase">{feature.title}</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Column 1: Info and Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="lg:col-span-4 space-y-6"
          >
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black uppercase tracking-tight">
                PC<span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Store</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Your ultimate destination for ultimate tech builds. Crafting precision high-tier systems and supplying competitive modular hardware.
            </p>
            <div className="space-y-3 pt-2 text-sm text-neutral-300">
              <div className="flex items-center gap-3 group">
                <FiMapPin className="text-purple-400 w-4 h-4 flex-shrink-0" />
                <span className="group-hover:text-white transition">Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3 group">
                <FiPhone className="text-purple-400 w-4 h-4 flex-shrink-0" />
                <span className="group-hover:text-white transition">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 group">
                <FiMail className="text-purple-400 w-4 h-4 flex-shrink-0" />
                <span className="group-hover:text-white transition">support@pcstore.com</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-3 pt-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500/20 transition-all"
              >
                <svg className="fill-white w-4 h-4" viewBox="0 0 512 512">
                  <path d="M211.9 197.4h-36.7v59.9h36.7V433.1h70.5V256.5h49.2l5.2-59.1h-54.4c0 0 0-22.1 0-33.7 0-13.9 2.8-19.5 16.3-19.5 10.9 0 38.2 0 38.2 0V82.9c0 0-40.2 0-48.8 0 -52.5 0-76.1 23.1-76.1 67.3C211.9 188.8 211.9 197.4 211.9 197.4z" />
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500/20 transition-all"
              >
                <svg className="fill-white w-4 h-4" viewBox="0 0 512 512">
                  <g transform="translate(64, 64) scale(0.75, 0.75)">
                    <path d="M403.2 48h78.643l-171.52 196.544L512 488h-158.016l-123.744-161.248L99.136 488H10.112l183.456-210.24L0 48h161.024l111.84 148.288L403.2 48zm-27.52 417.792h43.52L138.368 68.672H91.776z" />
                  </g>
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shadow-md shadow-purple-950/40"
              >
                <svg className="fill-white w-4 h-4" viewBox="0 0 512 512">
                  <path d="M256 109.3c47.8 0 53.4 0.2 72.3 1 17.4 0.8 26.9 3.7 33.2 6.2 8.4 3.2 14.3 7.1 20.6 13.4 6.3 6.3 10.1 12.2 13.4 20.6 2.5 6.3 5.4 15.8 6.2 33.2 0.9 18.9 1 24.5 1 72.3s-0.2 53.4-1 72.3c-0.8 17.4-3.7 26.9-6.2 33.2 -3.2 8.4-7.1 14.3-13.4 20.6 -6.3 6.3-12.2 10.1-20.6 13.4 -6.3 2.5-15.8 5.4-33.2 6.2 -18.9 0.9-24.5 1-72.3 1s-53.4-0.2-72.3-1c-17.4-0.8-26.9-3.7-33.2-6.2 -8.4-3.2-14.3-7.1-20.6-13.4 -6.3-6.3-10.1-12.2-13.4-20.6 -2.5-6.3-5.4-15.8-6.2-33.2 -0.9-18.9-1-24.5-1-72.3s0.2-53.4 1-72.3c0.8-17.4 3.7-26.9 6.2-33.2 3.2-8.4 7.1-14.3 13.4-20.6 6.3-6.3 12.2-10.1 20.6-13.4 6.3-2.5 15.8-5.4 33.2-6.2C202.6 109.5 208.2 109.3 256 109.3z" />
                  <path d="M256 164.1c-50.7 0-91.9 41.1-91.9 91.9s41.1 91.9 91.9 91.9 91.9-41.1 91.9-91.9S306.7 164.1 256 164.1z" />
                  <circle cx="351.5" cy="160.5" r="21.5" />
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500/20 transition-all"
              >
                <svg className="fill-white w-4 h-4" viewBox="0 0 512 512">
                  <path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6zM222.2 303.4v-94.6l90.7 47.3L222.2 303.4z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Column 2: Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Shop</h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 hover:text-purple-400 transition-all duration-200 inline-block hover:translate-x-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Support</h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 hover:text-purple-400 transition-all duration-200 inline-block hover:translate-x-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Newsletter Sign-Up */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Newsletter</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Get premium deals, build guides, and immediate inventory restocking updates.
            </p>

            <div className="pt-2">
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-neutral-500 pr-32"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-neutral-900 border border-white/10 hover:border-purple-500/50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                >
                  <FiSend className="w-3 h-3" /> Subscribe
                </button>
              </form>

              <div className="h-4 mt-2">
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-emerald-400 font-medium"
                  >
                    ✓ Successfully subscribed!
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-16 pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <p>
              &copy; {currentYear} PCStore. All rights reserved. Built with <FiHeart className="inline text-pink-500 w-3 h-3 mx-0.5" /> for gamers
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="hover:text-purple-400 transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-purple-400 transition">Terms of Service</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer