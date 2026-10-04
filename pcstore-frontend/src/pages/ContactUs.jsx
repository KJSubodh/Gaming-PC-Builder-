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
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitStatus(null), 4000)
    }, 1500)
  }

  const contactMethods = [
    {
      icon: FiPhone,
      title: 'Phone',
      value: '+91 98765 43210',
      href: 'tel:+919876543210',
      subtitle: 'Mon-Fri • 9am - 6pm IST'
    },
    {
      icon: FiMail,
      title: 'Email',
      value: 'support@pcstore.com',
      href: 'mailto:support@pcstore.com',
      subtitle: 'Response within 2 hours'
    },
    {
      icon: FiMapPin,
      title: 'Location',
      value: 'Silicon Boulevard, Bangalore',
      href: 'https://maps.google.com',
      target: '_blank',
      subtitle: 'Karnataka, 560001'
    }
  ]

  return (
    <div className="min-h-screen bg-white pb-24">

      {/* Premium Hero Section - Matching PCBuilder */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-20 mb-8 border-b border-purple-500/10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 tracking-wider uppercase">
            <FiMessageSquare className="w-3.5 h-3.5" /> Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
            Have questions about custom builds, enterprise procurement, or order status? Our team is here to help you with everything PC-related.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FiClock className="text-purple-500" /> <span>24/7 Support Network</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-purple-500" /> <span>Secure Communication</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Contact Methods Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.a
                key={index}
                href={method.href}
                target={method.target || '_self'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="group bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-lg hover:border-neutral-300 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center group-hover:bg-neutral-900 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">{method.title}</p>
                    <p className="text-sm font-semibold text-neutral-900 truncate">{method.value}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{method.subtitle}</p>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Form & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-neutral-200">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-600">
                <FiMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Send us a Message</h2>
                <p className="text-sm text-neutral-500 mt-0.5">Fill out the form and we'll get back to you shortly</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                    <FiUser className="text-neutral-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition duration-200 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                    <FiMail className="text-neutral-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition duration-200 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                  <FiInfo className="text-neutral-400" /> Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Custom PC Configuration Request"
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition duration-200 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                  <FiMessageSquare className="text-neutral-400" /> Message
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition duration-200 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 text-emerald-700 text-sm font-medium"
                >
                  <FiCheckCircle className="text-base shrink-0" />
                  <span>Message sent successfully! We'll get back to you shortly.</span>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-neutral-200">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-600">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Visit Our Store</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">Come see our builds in person</p>
                </div>
              </div>

              <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden min-h-[300px]">
                <iframe
                  title="Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9969296403067!2d77.6046!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  className="w-full h-full"
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>

              {/* Store Info */}
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Address</p>
                      <p className="text-xs text-neutral-500">1024 Silicon Boulevard, Suite 404, Bangalore, Karnataka 560001</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiClock className="w-4 h-4 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Business Hours</p>
                      <p className="text-xs text-neutral-500">Mon-Fri: 9:00 AM - 6:00 PM IST<br />Sat: 10:00 AM - 4:00 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default ContactUs