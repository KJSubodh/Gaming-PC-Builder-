import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiMail, FiPhone, FiMapPin, FiClock, FiSend,
  FiMessageSquare, FiUser, FiInfo, FiCheckCircle
} from 'react-icons/fi'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API transport channel submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })

      // Clear success notification telemetry after timeout banner
      setTimeout(() => setSubmitStatus(null), 4000)
    }, 1500)
  }

  const contactMethods = [
    {
      icon: FiPhone,
      title: 'Voice Telemetry Support',
      value: '+1 (555) 234-5678',
      actionLabel: 'Call Tech Support',
      href: 'tel:+15552345678',
      gradient: 'from-blue-600 to-cyan-500',
      subtitle: 'Mon-Fri • 9am - 6pm EST'
    },
    {
      icon: FiMail,
      title: 'Digital Mail Protocol',
      value: 'support@pcstore.com',
      actionLabel: 'Open Ticket Workspace',
      href: 'mailto:support@pcstore.com',
      gradient: 'from-purple-600 to-pink-500',
      subtitle: 'Average response: < 2 hours'
    },
    {
      icon: FiMapPin,
      title: 'Physical HQ Matrix',
      value: '1024 Silicon Boulevard, Suite 404',
      actionLabel: 'Get Coordinates',
      href: 'https://maps.google.com',
      target: '_blank',
      gradient: 'from-emerald-600 to-teal-500',
      subtitle: 'Austin, Texas, 78701'
    }
  ]

  // Animation layout matrix settings
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden">

      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative py-20 lg:py-28 border-b border-white/5 bg-slate-950">
        {/* Background Mesh Radial Flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Core Copywriting Block */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-purple-400 uppercase mb-6"
              >
                <FiMessageSquare className="w-3.5 h-3.5" /> Communications Relay
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-black mb-6 tracking-tight leading-tight"
              >
                Let's Build Something{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400 bg-clip-text text-transparent">
                  Legendary
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed mb-8"
              >
                Have questions regarding custom component synchronization, enterprise procurement schedules, or order dispatch status vectors? Connect directly with our high-performance technical division.
              </motion.p>

              {/* Quick Info Micro Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <FiClock className="text-purple-500" /> <span>24/7 Monitoring Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-pink-500" /> <span>100% Secure SSL Exchange</span>
                </div>
              </motion.div>
            </div>

            {/* Hero Telemetry Clickable Grid Cards Stack */}
            <div className="lg:col-span-5">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <motion.a
                      key={index}
                      href={method.href}
                      target={method.target || '_self'}
                      rel="noopener noreferrer"
                      variants={itemVariants}
                      whileHover={{ x: 6, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                      className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-300 group hover:border-purple-500/30 shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${method.gradient} p-0.5`}>
                          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                            <Icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{method.title}</h4>
                          <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors duration-300">{method.value}</p>
                          <p className="text-[11px] text-gray-600 mt-0.5">{method.subtitle}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pr-2">
                        {method.actionLabel} →
                      </span>
                    </motion.a>
                  )
                })}
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE CONTENT DIVISION: FORM & INTERACTIVE MAP SYSTEM */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* CONTACT INTERFACE FORM FIELD */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Initialize Secure Message</h2>
              <p className="text-sm text-gray-400">Fill out the network parameters to route your request packet straight to the corresponding department.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><FiUser className="text-purple-500" /> Full Identity</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Linus Torvalds"
                    className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><FiMail className="text-pink-500" /> Digital Return Mail</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="linus@linuxfoundation.org"
                    className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><FiInfo className="text-blue-500" /> Routing Subject Header</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Custom PC Configuration Request"
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><FiMessageSquare className="text-emerald-500" /> Detailed Narrative Packet</label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Elaborate on hardware specifications, pipeline bottlenecks, or system requirements..."
                  className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 text-sm shadow-inner resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:to-rose-400 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                    <span>Broadcasting Transmission...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>Transmit Secure Message</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Notification Banner Overlay */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-x-6 bottom-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-400 text-xs font-medium"
              >
                <FiCheckCircle className="text-base shrink-0" />
                <span>Transmission successfully confirmed! Our core engineering staff will reply shortly.</span>
              </motion.div>
            )}
          </div>

          {/* 3. HARDWARE IFRAME GOOGLE MAP CONTAINER */}
          <div className="lg:col-span-5 flex flex-col h-full justify-between">
            <div className="w-full h-full min-h-[400px] bg-white/5 border border-white/10 rounded-3xl p-2 shadow-2xl relative group overflow-hidden">

              {/* Micro Frame Corner Elements for High-Tech Aesthetic */}
              <div className="absolute top-4 left-4 w-2 h-2 border-t-2 border-l-2 border-purple-500 z-10 pointer-events-none" />
              <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-purple-500 z-10 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-purple-500 z-10 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-2 h-2 border-b-2 border-r-2 border-purple-500 z-10 pointer-events-none" />

              {/* Integrated Google Map Embed Vector (Styled to Dark Mode parameters using canvas overlay filters) */}
              <iframe
                title="Bangalore Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9969296403067!2d77.6046!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                className="rounded-[22px] w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}

export default ContactUs