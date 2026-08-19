import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCpu, FiMonitor, FiHardDrive, FiZap, FiShoppingCart, FiCheckCircle, FiArrowRight } from 'react-icons/fi'

const PreBuiltPC = () => {
  const preBuiltConfigs = [
    {
      id: 1,
      name: "Gaming Starter",
      price: 45000,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500",
      description: "Perfect for 1080p gaming. Great for beginners!",
      specs: {
        cpu: "Intel Core i5-12400F",
        gpu: "NVIDIA RTX 3050",
        ram: "16GB DDR4",
        storage: "512GB NVMe SSD",
        psu: "550W Bronze",
        motherboard: "B660M"
      },
      performance: "1080p Gaming - 60+ FPS",
      games: ["Valorant", "CS:GO", "Fortnite", "GTA V"],
      badge: "Best Seller",
      badgeColor: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      name: "Performance Pro",
      price: 85000,
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",
      description: "High-end 1440p gaming rig with RGB lighting",
      specs: {
        cpu: "AMD Ryzen 7 5800X",
        gpu: "NVIDIA RTX 4070",
        ram: "32GB DDR4",
        storage: "1TB NVMe SSD",
        psu: "750W Gold",
        motherboard: "B550"
      },
      performance: "1440p Gaming - 120+ FPS",
      games: ["Call of Duty", "Apex Legends", "Cyberpunk", "Battlefield"],
      badge: "Popular Choice",
      badgeColor: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      name: "Ultimate Elite",
      price: 150000,
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf16c?w=500",
      description: "Ultimate 4K gaming beast with liquid cooling",
      specs: {
        cpu: "Intel Core i9-13900K",
        gpu: "NVIDIA RTX 4080",
        ram: "64GB DDR5",
        storage: "2TB NVMe SSD",
        psu: "1000W Platinum",
        motherboard: "Z790"
      },
      performance: "4K Gaming - 144+ FPS + RTX",
      games: ["All AAA Titles", "4K Gaming", "Streaming", "Content Creation"],
      badge: "Ultimate Power",
      badgeColor: "from-amber-500 to-orange-500"
    }
  ]

  const addToCart = (build) => {
    alert(`${build.name} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section - KEPT AS IS */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-b border-purple-500/10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5 tracking-wider uppercase">
            🚀 PREMIUM GAMING RIGS
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Pre-Built Gaming PCs
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Professionally built, tested, and ready to ship. Choose your perfect gaming companion.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Builds Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {preBuiltConfigs.map((build, idx) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-neutral-100">
                <img
                  src={build.image}
                  alt={build.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${build.badgeColor} shadow-md`}>
                  {build.badge}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{build.name}</h3>
                <p className="text-neutral-500 text-sm mb-4">{build.description}</p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 px-2 py-1.5 rounded-lg">
                    <FiCpu className="text-purple-500 w-3.5 h-3.5" />
                    <span className="truncate">{build.specs.cpu.split(' ').slice(0,2).join(' ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 px-2 py-1.5 rounded-lg">
                    <FiMonitor className="text-purple-500 w-3.5 h-3.5" />
                    <span className="truncate">{build.specs.gpu.split(' ').slice(0,2).join(' ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 px-2 py-1.5 rounded-lg">
                    <FiHardDrive className="text-purple-500 w-3.5 h-3.5" />
                    <span className="truncate">{build.specs.storage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 px-2 py-1.5 rounded-lg">
                    <FiZap className="text-purple-500 w-3.5 h-3.5" />
                    <span className="truncate">{build.specs.ram}</span>
                  </div>
                </div>

                {/* Performance & Games */}
                <div className="border-t border-neutral-100 pt-3 mb-4">
                  <p className="text-xs text-green-600 font-medium mb-2">✓ {build.performance}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {build.games.map(game => (
                      <span key={game} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                        {game}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <div>
                    <span className="text-2xl font-bold text-neutral-900">₹{build.price.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => addToCart(build)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                  >
                    <FiShoppingCart className="w-3.5 h-3.5" /> Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16 bg-neutral-50 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center text-neutral-900 mb-8">Why Choose Our Pre-Built PCs?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">Quality Parts</h3>
              <p className="text-xs text-neutral-500">Premium components from trusted brands</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheckCircle className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">Expert Assembly</h3>
              <p className="text-xs text-neutral-500">Professionally built and tested</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheckCircle className="text-purple-600 text-xl" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">Warranty Support</h3>
              <p className="text-xs text-neutral-500">1 year warranty with support</p>
            </div>
          </div>
        </div>

        {/* Custom Build CTA */}
        <div className="mt-8 bg-slate-900 rounded-2xl p-6 md:p-8 text-center text-slate-200 border border-white/10 shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Want Something Custom?</h2>
          <p className="text-white/80 text-sm mb-5">Use our PC Builder to create your perfect custom configuration</p>
          <Link 
            to="/pc-builder" 
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition text-sm"
          >
            Build Your Own PC <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PreBuiltPC