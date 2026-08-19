import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCpu, FiUsers, FiAward, FiCheckCircle, FiShield, FiHeart } from 'react-icons/fi'

const AboutUs = () => {
  // Vertical top-to-bottom entrance animation for the Hero elements
  const topToBottomVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: (customDelay) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: customDelay
      }
    })
  }

  // General scroll reveal variants for grid elements below the fold
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  const values = [
    { icon: FiCpu, title: 'Premium Hardware Only', desc: 'We strictly source from authorized distributors to guarantee 100% authentic components with official manufacturer warranties.' },
    { icon: FiShield, title: 'Uncompromised Support', desc: 'Building a PC can be daunting. Our team of certified technicians stands by you from parts selection down to post-purchase support.' },
    { icon: FiHeart, title: 'Built for Gamers by Gamers', desc: "We don't just sell components; we live and breathe high frame rates, low latency, and meticulously optimized thermal setups." }
  ]

  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '25K+', label: 'Components Shipped' },
    { value: '5,000+', label: 'Custom Rigs Built' },
    { value: '99.4%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-gray-300 overflow-hidden">
      
      {/* --- HERO HEADER SECTION --- */}
      <section className="relative py-20 lg:py-40 border-b border-white/10 flex items-center justify-center">
        {/* Deep background ambient glowing orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={topToBottomVariants}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <FiAward className="w-3.5 h-3.5" /> Our Story
            </span>
          </motion.div>

          <motion.h1
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={topToBottomVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white"
          >
            Powering Your{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Gaming Potential
            </span>
          </motion.h1>

          <motion.p
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={topToBottomVariants}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Founded in 2020, PCStore was born out of a simple frustration: getting premium, compatible computer parts safely configuration-matched shouldn't be a gamble. We bridge the gap between heavy computing needs and seamless execution.
          </motion.p>

          <motion.div
            custom={0.4}
            initial="hidden"
            animate="visible"
            variants={topToBottomVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/products"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300"
            >
              Explore Products
            </Link>
            <Link
              to="/pc-builder"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              Start Custom Build
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- STATS COUNTER SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUpVariants}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center backdrop-blur-sm"
            >
              <h3 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- MISSION & CORE VALUES --- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">What Sets Us Apart</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We engineer customer satisfaction from the moment you research your silicon specs to the second your power button illuminates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUpVariants}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm relative"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* --- VISION STATEMENT & CALLOUT --- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpVariants}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-slate-900/30 border border-purple-500/20 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to elevate your operational setup?</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Whether you are rendering cinematic animations, parsing deep learning pipelines, or aiming for top leaderboard standings, our rigs are benchmarked to match performance expectations.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 font-semibold rounded-xl hover:bg-gray-100 transition duration-300"
          >
            Talk to an Expert <FiCheckCircle className="text-purple-600" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default AboutUs