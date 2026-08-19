import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiCpu, FiPackage, FiWind, FiTool, FiHardDrive, FiSettings, 
  FiShield, FiTruck, FiClock, FiAward, FiUsers, FiHeadphones,
  FiCheckCircle, FiArrowRight
} from 'react-icons/fi'

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Custom PC Builds',
      icon: FiCpu,
      description: 'Fully customized gaming and workstation PCs tailored to your exact needs, budget, and performance requirements.',
      features: ['Component selection assistance', 'Compatibility guaranteed', 'Stress testing included', '1 year warranty'],
      color: 'from-purple-600 to-pink-500',
      bg: 'bg-purple-500/10',
      link: '/pc-builder'
    },
    {
      id: 2,
      title: 'Pre-Built PCs',
      icon: FiPackage,
      description: 'Ready-to-ship gaming PCs, professionally assembled and tested for plug-and-play performance.',
      features: ['Ready to ship', 'Quality tested', 'Budget friendly', 'Warranty included'],
      color: 'from-blue-600 to-cyan-500',
      bg: 'bg-blue-500/10',
      link: '/pre-built'
    },
    {
      id: 3,
      title: 'PC Cleanups',
      icon: FiWind,
      description: 'Professional dust removal, thermal paste replacement, and internal cleaning to extend your PC\'s lifespan.',
      features: ['Dust removal', 'Thermal paste replacement', 'Cable management', 'Performance optimization'],
      color: 'from-green-600 to-emerald-500',
      bg: 'bg-green-500/10',
      link: '/contact'
    },
    {
      id: 4,
      title: 'PC Repairs',
      icon: FiTool,
      description: 'Expert diagnosis and repair for hardware failures, boot issues, crashes, and performance problems.',
      features: ['Hardware diagnosis', 'Component replacement', 'Boot & crash fixes', 'Same-day service'],
      color: 'from-orange-600 to-red-500',
      bg: 'bg-orange-500/10',
      link: '/contact'
    },
    {
      id: 5,
      title: 'Windows Installation',
      icon: FiHardDrive,
      description: 'Clean Windows installation, driver setup, and system optimization for maximum performance.',
      features: ['Clean Windows install', 'Driver installation', 'System optimization', 'Data backup option'],
      color: 'from-cyan-600 to-blue-500',
      bg: 'bg-cyan-500/10',
      link: '/contact'
    },
    {
      id: 6,
      title: 'Hardware Upgrades',
      icon: FiSettings,
      description: 'Component upgrades, modifications, and performance enhancements for your existing system.',
      features: ['CPU/GPU upgrades', 'RAM/Storage upgrades', 'Cooling system mods', 'Performance tuning'],
      color: 'from-yellow-600 to-orange-500',
      bg: 'bg-yellow-500/10',
      link: '/products'
    }
  ]

  const reasons = [
    { icon: FiAward, title: 'Expert Technicians', desc: 'Certified professionals with years of experience' },
    { icon: FiShield, title: 'Quality Guarantee', desc: 'All services backed by warranty' },
    { icon: FiClock, title: 'Fast Turnaround', desc: 'Most services completed within 24-48 hours' },
    { icon: FiUsers, title: '1000+ Happy Clients', desc: 'Trusted by gamers and professionals' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
    { icon: FiTruck, title: 'Pick & Drop', desc: 'Free pickup and delivery service' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 border-b border-purple-500/10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5 tracking-wider uppercase">
            PREMIUM SERVICES
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Expert PC Solutions
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            From custom builds to professional repairs, we've got you covered. 
            Professional service with a personal touch.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-neutral-900">What We Offer</h2>
          <p className="text-neutral-500 mt-2">Comprehensive PC services tailored to your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${service.color.split('-')[1]}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{service.title}</h3>
                <p className="text-neutral-500 text-sm mb-4 leading-relaxed">{service.description}</p>
                <div className="space-y-1.5 mb-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                      <FiCheckCircle size={12} className="text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={service.link}
                  className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors group/link"
                >
                  Learn More <FiArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-neutral-50 border-y border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-neutral-900">Why Choose Us</h2>
            <p className="text-neutral-500 mt-2">What makes us different from the rest</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => {
              const Icon = reason.icon
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{reason.title}</h3>
                    <p className="text-sm text-neutral-500 mt-0.5">{reason.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-950 rounded-2xl p-8 text-center text-slate-200 border border-slate-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-3">Need Expert Assistance?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Get in touch with our team for a free consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-6 py-2.5 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
            <Link
              to="/pc-builder"
              className="px-6 py-2.5 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Start Building
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services