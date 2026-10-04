// src/pages/Home/Categories.jsx
import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productService } from '../../services/productService'
import {
  FiArrowRight, FiChevronLeft, FiChevronRight
} from 'react-icons/fi'

// Import images
import cpuImg from '../../assets/PC Parts Images/CPU.jpg'
import gpuImg from '../../assets/PC Parts Images/GPU.jpg'
import motherboardImg from '../../assets/PC Parts Images/Motherboard.jpg'
import ramImg from '../../assets/PC Parts Images/RAM.jpg'
import psuImg from '../../assets/PC Parts Images/PSU.jpg'
import caseImg from '../../assets/PC Parts Images/PC Case.jpg'
import coolerImg from '../../assets/PC Parts Images/Air Cooler.jpg'
import ssdImg from '../../assets/PC Parts Images/SSD.jpg'
import sataSsdImg from '../../assets/PC Parts Images/SATA SSD.jpg'
import hddImg from '../../assets/PC Parts Images/HDD.jpg'
import monitorImg from '../../assets/PC Parts Images/Monitor.jpg'
import keyboardImg from '../../assets/PC Parts Images/Gaming Keyboard.jpg'
import mouseImg from '../../assets/PC Parts Images/Gaming Mouse.jpg'
import headsetImg from '../../assets/PC Parts Images/Gaming Headset.jpg'
import microphoneImg from '../../assets/PC Parts Images/Gaming Microphone.jpg'

const Categories = () => {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef(null)

  // Fetch all products to get dynamic counts
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => productService.getAllProducts(),
    staleTime: 5 * 60 * 1000,
  })

  // Define categories with images and enum mappings
  const categoryConfig = [
    { name: "CPU", enum: "CPU", image: cpuImg },
    { name: "GPU", enum: "GPU", image: gpuImg },
    { name: "Motherboard", enum: "MOTHERBOARD", image: motherboardImg },
    { name: "RAM", enum: "RAM", image: ramImg },
    { name: "PSU", enum: "PSU", image: psuImg },
    { name: "Case", enum: "CASE", image: caseImg },
    { name: "Cooling", enum: "COOLING_CPU_AIR", image: coolerImg },
    { name: "NVMe SSD", enum: "STORAGE_NVME", image: ssdImg },
    { name: "SATA SSD", enum: "STORAGE_SATA", image: sataSsdImg },
    { name: "HDD", enum: "STORAGE_HDD", image: hddImg },
    { name: "Monitor", enum: "MONITOR", image: monitorImg },
    { name: "Keyboard", enum: "KEYBOARD", image: keyboardImg },
    { name: "Mouse", enum: "MOUSE", image: mouseImg },
    { name: "Headset", enum: "HEADPHONE", image: headsetImg },
    { name: "Microphone", enum: "MICROPHONE", image: microphoneImg },
  ]

  // Build categories with dynamic counts from products
  const categories = categoryConfig.map(cat => {
    const count = allProducts?.filter(p => p.category === cat.enum).length || 0
    return { ...cat, count }
  })

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying && categories.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % categories.length)
      }, 4500)
    }
    return () => clearInterval(autoPlayRef.current)
  }, [isAutoPlaying, categories.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const getCategoryDescription = (name) => {
    const descriptions = {
      'CPU': 'High-performance processors for gaming and productivity',
      'GPU': 'Powerful graphics cards for stunning visuals',
      'Motherboard': 'Reliable foundations for your build',
      'RAM': 'High-speed memory for seamless multitasking',
      'PSU': 'Efficient power supplies for stable performance',
      'Case': 'Stylish enclosures with optimal airflow',
      'Cooling': 'Advanced cooling solutions for peak performance',
      'NVMe SSD': 'Ultra-fast storage for instant load times',
      'SATA SSD': 'Reliable solid-state storage for daily use',
      'HDD': 'High-capacity storage for all your files',
      'Monitor': 'Immersive displays with high refresh rates',
      'Keyboard': 'Precision mechanical keyboards for gaming',
      'Mouse': 'High-DPI gaming mice with precision tracking',
      'Headset': 'Immersive audio headsets for competitive gaming',
      'Microphone': 'Crystal clear microphones for streaming and communication',
    }
    return descriptions[name] || `Explore our collection of ${name} components`
  }

  const currentCategory = categories[currentIndex] || categories[0]

  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-slate-800"></div>
            <p className="mt-2 text-sm text-slate-500">Loading categories...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Shop by Category
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Browse components and accessories by type
          </p>
        </motion.div>

        {/* Main Slider */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Buttons - Modern */}
          <button
            onClick={handlePrev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center shadow-lg hover:shadow-xl"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center shadow-lg hover:shadow-xl"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-500"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-3/5 h-[280px] md:h-[380px] overflow-hidden bg-slate-100">
                  <img
                    src={currentCategory.image}
                    alt={currentCategory.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
                  
                  {/* Category Badge - Modern */}
                  <div className="absolute top-5 left-5 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-xl text-xs font-semibold text-slate-800 shadow-lg border border-white/30 tracking-wide">
                    {currentCategory.name}
                  </div>
                  
                  {/* Product Count Badge - Modern */}
                  <div className="absolute bottom-5 left-5 px-4 py-2 bg-slate-900/85 backdrop-blur-sm rounded-xl text-xs font-medium text-white shadow-lg border border-white/10">
                    {currentCategory.count} Products
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-2/5 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">
                    Category
                  </span>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                    {currentCategory.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">
                    {getCategoryDescription(currentCategory.name)}
                  </p>
                  
                  <button
                    onClick={() => navigate(`/products?category=${currentCategory.enum}`)}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
                  >
                    Browse Collection
                    <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Modern Pagination - Inspired by Flickity */}
          <div className="flex justify-center items-center gap-1.5 mt-6">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsAutoPlaying(false)
                  setTimeout(() => setIsAutoPlaying(true), 5000)
                }}
                className={`transition-all duration-700 ease-in-out rounded-full ${
                  currentIndex === index
                    ? 'w-10 h-1.5 bg-slate-800'
                    : 'w-2 h-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar - Minimal */}
          {isAutoPlaying && categories.length > 1 && (
            <div className="w-full max-w-xs mx-auto mt-2 h-px bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 4.5, ease: "linear" }}
                className="h-full bg-slate-700 rounded-full"
              />
            </div>
          )}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate('/products')}
            className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors inline-flex items-center gap-1 group"
          >
            View All Categories
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Categories