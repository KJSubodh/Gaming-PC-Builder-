// src/pages/Home/Testimonials.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiPause, FiArrowLeft, FiArrowRight } from 'react-icons/fi'

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Enthusiast Overclocker",
    content: "The custom liquid cooling loop is an absolute work of art. My CPU and GPU temps haven't crossed 60°C even under heavy synthetic benchmarking. Absolutely stellar craftsmanship.",
    rating: 5,
    avatar: "A",
  },
  {
    name: "Sarah Chen",
    role: "3D Animator & Creator",
    content: "Render times are money in my industry. The dual RTX 4090 setup they built for me has cut my rendering times in half. The cable management is so clean it looks wireless.",
    rating: 5,
    avatar: "S",
  },
  {
    name: "Marcus Rodriguez",
    role: "First-Time Builder",
    content: "Upgrading from a console was intimidating, but their compatibility checker made picking parts a breeze. Shipped fast, packaged incredibly well, and booted up on the first try.",
    rating: 5,
    avatar: "M",
  },
  {
    name: "David Kim",
    role: "Twitch Streamer",
    content: "I needed a rig that could game at 1440p while encoding a 1080p stream simultaneously. They optimized the BIOS, set up the fan curves perfectly, and it runs dead silent.",
    rating: 5,
    avatar: "D",
  },
  {
    name: "Jordan Smith",
    role: "Competitive FPS Player",
    content: "In Valorant, frames win games. This PC consistently pushes 500+ FPS, and the 1% lows are incredibly stable. The latency difference is night and day.",
    rating: 5,
    avatar: "J",
  },
  {
    name: "Priya Sharma",
    role: "Content Creator",
    content: "Video editing on this machine is buttery smooth. 4K timelines, multiple effects, and no lag whatsoever. Best investment for my channel.",
    rating: 5,
    avatar: "P",
  },
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const autoPlayRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const cardsPerView = isMobile ? 1 : 3
  const totalSlides = Math.ceil(testimonials.length / cardsPerView)

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides)
      }, 5000)
    }
    return () => clearInterval(autoPlayRef.current)
  }, [isAutoPlaying, totalSlides])

  const getVisibleTestimonials = () => {
    const start = currentIndex * cardsPerView
    return testimonials.slice(start, start + cardsPerView)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
    setIsAutoPlaying(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
    setIsAutoPlaying(false)
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xs ${i < rating ? 'text-amber-500' : 'text-gray-300'}`}>★</span>
        ))}
      </div>
    )
  }

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              What Our <span className="text-gray-900">Customers Say</span>
            </h2>
            <p className="text-gray-500">Real reviews from real builders</p>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-9 h-9 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
              title={isAutoPlaying ? "Pause Autoplay" : "Start Autoplay"}
            >
              {isAutoPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrev}
              className="w-9 h-9 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            {getVisibleTestimonials().map((testimonial, idx) => (
              <motion.div
                key={`${currentIndex}-${idx}`}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="flex flex-col bg-white border border-gray-200 rounded-2xl p-6 relative hover:shadow-md transition-all duration-300"
              >
                {/* Stars */}
                <div className="mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                
                {/* Content */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1 italic">
                  "{testimonial.content}"
                </p>
                
                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(totalSlides)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx)
                setIsAutoPlaying(false)
              }}
              className={`transition-all duration-300 h-1.5 rounded-full cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        {isAutoPlaying && (
          <div className="w-full max-w-xs mx-auto mt-5 h-[2px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-gray-900 rounded-full"
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials