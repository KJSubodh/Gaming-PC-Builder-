// src/pages/Home/HeroSlider.jsx
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCpu, FiShoppingBag, FiTrendingUp, FiZap, FiShield, FiTruck } from 'react-icons/fi'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

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
          bulletActiveClass: '!bg-cyan-500 !w-8 !rounded-full'
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        loop={true}
        className="h-[480px] sm:h-[520px] md:h-[580px] lg:h-[620px]"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full overflow-hidden bg-slate-950">
              {/* Animated Background Orbs - Cyan theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-cyan-600/15 rounded-full blur-[80px] md:blur-[100px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-blue-600/15 rounded-full blur-[80px] md:blur-[100px] animate-pulse delay-1000" />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
              
              {/* Content - Centered with responsive padding and overflow handling */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center overflow-y-auto py-8 sm:py-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="w-full max-w-4xl mx-auto"
                >
                  {/* Badge */}
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 sm:mb-5 md:mb-6 tracking-wider uppercase">
                    {slide.badge}
                  </span>
                  
                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 md:mb-4 tracking-tight text-white px-2">
                    {slide.title}
                  </h1>
                  
                  {/* Subtitle */}
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-400 font-semibold mb-2 sm:mb-3 md:mb-4">
                    {slide.subtitle}
                  </p>
                  
                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-5 md:mb-6 px-4">
                    {slide.description}
                  </p>
                  
                  {/* Stats as inline pills */}
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 mb-5 sm:mb-6 md:mb-8">
                    {slide.stats.map((stat, i) => (
                      <div key={i} className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full bg-white/5 border border-white/10">
                        <span className="font-bold text-white text-xs sm:text-sm md:text-base">{stat.value}</span>
                        <span className="text-[10px] sm:text-xs text-gray-400 ml-0.5 sm:ml-1">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                    <Link
                      to={slide.ctaLink}
                      className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-8 py-2 sm:py-2.5 md:py-3.5 bg-white text-slate-950 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-xs sm:text-sm md:text-base"
                    >
                      {slide.ctaText}
                      <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to={slide.secondaryLink}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-8 py-2 sm:py-2.5 md:py-3.5 border-2 border-white/20 text-white rounded-lg font-bold hover:bg-white/10 transition-all text-xs sm:text-sm md:text-base"
                    >
                      {slide.secondaryCta}
                    </Link>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-5 sm:mt-6 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-white/10">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <FiShield className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-green-400" />
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-400">Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <FiTruck className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-blue-400" />
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-400">Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="flex text-yellow-400 text-[9px] sm:text-[10px] md:text-xs">★★★★★</div>
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-400">4.9/5 Rating</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-cyan-500/50 hover:border-cyan-500 transition-all items-center justify-center cursor-pointer">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="swiper-button-next-custom hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-cyan-500/50 hover:border-cyan-500 transition-all items-center justify-center cursor-pointer">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default HeroSlider