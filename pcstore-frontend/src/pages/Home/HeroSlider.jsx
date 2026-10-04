// src/pages/Home/HeroSlider.jsx
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShield, FiTruck, FiStar } from 'react-icons/fi'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// Import gaming themed images
import pcBuilderImg from '/src/assets/build-your-own-PC.jpg'
import newArrivalsImg from '/src/assets/gaming_PC_parts.jpg'
import prebuiltImg from '/src/assets/gaming_PC.jpg'
import peripheralsImg from '/src/assets/gaming_PC_accessories.jpg'

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: "Build Your Dream PC",
      subtitle: "Custom Configuration",
      description: "Handpick each component with our intelligent PC Builder. Real-time compatibility checking, price optimization, and performance forecasting.",
      ctaText: "Start Building",
      ctaLink: "/pc-builder",
      secondaryCta: "Browse Components",
      secondaryLink: "/products",
      badge: "🛠️ PC Builder",
      image: pcBuilderImg,
      stats: [
        { label: "Components", value: "500+" },
        { label: "Compatible Builds", value: "10K+" },
        { label: "Happy Gamers", value: "50K+" }
      ]
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh Stock Alert",
      description: "Latest RTX 50 Series, Ryzen 9000 processors, DDR5 RAM modules, and PCIe 5.0 SSDs now in stock. Be the first to upgrade.",
      ctaText: "Shop New Arrivals",
      ctaLink: "/products?sort=newest",
      secondaryCta: "View Deals",
      secondaryLink: "/products",
      badge: "🔥 Just Dropped",
      image: newArrivalsImg,
      stats: [
        { label: "New Products", value: "127" },
        { label: "Brands", value: "24" },
        { label: "Pre-order", value: "Available" }
      ]
    },
    {
      id: 3,
      title: "Pre-Built Gaming Rigs",
      subtitle: "Ready to Dominate",
      description: "Expertly assembled, tested, and optimized gaming PCs. Choose from our collection of battle-tested configurations for every budget.",
      ctaText: "View Pre-Builts",
      ctaLink: "/pre-built",
      secondaryCta: "Custom Build",
      secondaryLink: "/pc-builder",
      badge: "⚡ Performance Tested",
      image: prebuiltImg,
      stats: [
        { label: "Configurations", value: "25+" },
        { label: "Warranty", value: "3 Years" },
        { label: "Free Support", value: "Lifetime" }
      ]
    },
    {
      id: 4,
      title: "Premium Gaming Peripherals",
      subtitle: "Complete Your Setup",
      description: "Mechanical keyboards, high-DPI gaming mice, 4K monitors, and surround sound headsets. Everything you need for the ultimate battlestation.",
      ctaText: "Shop Peripherals",
      ctaLink: "/accessories",
      secondaryCta: "Explore Deals",
      secondaryLink: "/products",
      badge: "🎮 Pro Gear",
      image: peripheralsImg,
      stats: [
        { label: "Products", value: "300+" },
        { label: "Brands", value: "35" },
        { label: "Ratings", value: "4.9★" }
      ]
    }
  ]

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100 !mx-1.5',
          bulletActiveClass: '!bg-red-500 !w-8 !rounded-full'
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        loop={true}
        className="h-[520px] sm:h-[580px] md:h-[650px] lg:h-[700px]"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full overflow-hidden bg-slate-950">
              
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                {/* Dark Overlay Gradient - Gaming Style */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />
                
                {/* Gaming Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                
                {/* Gaming Glow Effects */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                
                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-red-500/20" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-red-500/20" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-red-500/20" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-red-500/20" />
                
                {/* Animated Pulse Orbs */}
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-orange-600/10 rounded-full blur-[60px] animate-pulse delay-1000" />
              </div>
              
              {/* Content - Left aligned for better readability */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-8 sm:py-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="w-full max-w-2xl"
                >
                  {/* Badge - Gaming themed */}
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-sm mb-4 sm:mb-5 md:mb-6 tracking-wider uppercase">
                    {slide.badge}
                  </span>
                  
                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 md:mb-4 tracking-tight text-white">
                    {slide.title}
                  </h1>
                  
                  {/* Subtitle - Gaming accent */}
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-red-400 font-semibold mb-2 sm:mb-3 md:mb-4">
                    {slide.subtitle}
                  </p>
                  
                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 max-w-xl leading-relaxed mb-4 sm:mb-5 md:mb-6">
                    {slide.description}
                  </p>
                  
                  {/* Stats as inline pills */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-8">
                    {slide.stats.map((stat, i) => (
                      <div key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                        <span className="font-bold text-white text-xs sm:text-sm md:text-base">{stat.value}</span>
                        <span className="text-[10px] sm:text-xs text-gray-400 ml-1">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <Link
                      to={slide.ctaLink}
                      className="group inline-flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:from-red-500 hover:to-orange-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-xs sm:text-sm md:text-base"
                    >
                      {slide.ctaText}
                      <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to={slide.secondaryLink}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 border-2 border-white/20 text-white rounded-lg font-bold hover:bg-white/10 hover:border-white/40 transition-all text-xs sm:text-sm md:text-base backdrop-blur-sm"
                    >
                      {slide.secondaryCta}
                    </Link>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <FiShield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                      <span className="text-[10px] sm:text-xs text-gray-400">Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiTruck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                      <span className="text-[10px] sm:text-xs text-gray-400">Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiStar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                      <span className="text-[10px] sm:text-xs text-gray-400">4.9/5 Rating</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Buttons - Gaming themed */}
      <button className="swiper-button-prev-custom hidden sm:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-white hover:bg-red-500/30 hover:border-red-500/50 transition-all items-center justify-center cursor-pointer">
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="swiper-button-next-custom hidden sm:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-white hover:bg-red-500/30 hover:border-red-500/50 transition-all items-center justify-center cursor-pointer">
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default HeroSlider