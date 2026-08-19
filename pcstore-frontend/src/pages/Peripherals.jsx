import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductCard from '../components/Common/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiSearch, FiFilter, FiX, FiChevronRight, FiShoppingBag, 
  FiMonitor, FiHeadphones, FiMic, FiCamera, FiSpeaker, FiBox
} from 'react-icons/fi'
import { MdGamepad } from 'react-icons/md'
import { FaKeyboard, FaMouse } from 'react-icons/fa'

const Peripherals = () => {
  const location = useLocation()
  
  // Get category from URL params
  const getCategoryFromURL = () => {
    const params = new URLSearchParams(location.search)
    return params.get('category') || 'all'
  }

  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromURL())
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Update selected category when URL changes
  useEffect(() => {
    const category = getCategoryFromURL()
    setSelectedCategory(category)
  }, [location.search])

  // Category configuration - ONLY PERIPHERALS
  const categoryConfig = {
    KEYBOARD: { name: 'Keyboards', icon: FaKeyboard },
    MOUSE: { name: 'Mice', icon: FaMouse },
    HEADPHONE: { name: 'Headphones', icon: FiHeadphones },
    MONITOR: { name: 'Monitors', icon: FiMonitor },
    MICROPHONE: { name: 'Microphones', icon: FiMic },
    WEBCAM: { name: 'Webcams', icon: FiCamera },
    SPEAKER: { name: 'Speakers', icon: FiSpeaker },
    CONTROLLER: { name: 'Controllers', icon: MdGamepad },
    MOUSE_PAD: { name: 'Mouse Pads', icon: FiBox },
  }

  const peripheralCategories = Object.entries(categoryConfig).map(([key, config]) => ({ 
    id: key, 
    ...config 
  }))

  // Fetch products by category - ONLY peripherals categories
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['peripherals', selectedCategory],
    queryFn: () => {
      if (selectedCategory === 'all') {
        // Fetch all peripherals categories
        const categories = Object.keys(categoryConfig)
        return productService.getProductsByCategories(categories)
      }
      return productService.getProductsByCategory(selectedCategory)
    },
    staleTime: 5 * 60 * 1000,
  })

  // Filter products based on search and price
  const filteredProducts = (allProducts || []).filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
    return matchesSearch && matchesPrice
  })

  const getCategoryDisplayName = (id) => {
    if (id === 'all') return 'All Peripherals'
    return categoryConfig[id]?.name || id
  }

  const renderSidebarLinks = () => (
    <nav className="space-y-4">
      {/* All Products */}
      <button
        onClick={() => { setSelectedCategory('all'); setIsMobileFilterOpen(false) }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
          selectedCategory === 'all'
            ? 'bg-neutral-900 text-white shadow-sm'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
      >
        <FiShoppingBag className={`w-4 h-4 ${selectedCategory === 'all' ? 'text-white' : 'text-neutral-400'}`} />
        <span className="flex-1">All Peripherals</span>
        {selectedCategory === 'all' && <FiChevronRight className="w-3 h-3" />}
      </button>

      {/* Peripherals Section */}
      <div>
        <div className="flex items-center gap-2 px-3 py-1.5">
          <div className="h-px flex-1 bg-neutral-200"></div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Peripherals
          </span>
          <div className="h-px flex-1 bg-neutral-200"></div>
        </div>
        <div className="mt-2 space-y-1">
          {peripheralCategories.map((cat) => {
            const Icon = cat.icon
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setIsMobileFilterOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span className="flex-1">{cat.name}</span>
                {isActive && <FiChevronRight className="w-3 h-3" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider & PC Components Link */}
      <div className="pt-2">
        <div className="my-3 border-t border-neutral-200"></div>
        <button
          onClick={() => { window.location.href = '/products' }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        >
          <FiShoppingBag className="w-4 h-4 text-neutral-400" />
          <span className="flex-1">PC Components</span>
          <FiChevronRight className="w-3 h-3 text-neutral-400" />
        </button>
      </div>
    </nav>
  )

  if (isLoading && !allProducts) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
          <p className="mt-4 text-gray-600">Loading peripherals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-900">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-slate-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 mb-4 tracking-wider uppercase">
            🎮 GAMING PERIPHERALS
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-white">
            Premium Peripherals
          </h1>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed mb-6">
            Equip your setup with high-performance gaming peripherals
          </p>
          <p className="text-slate-500 font-mono text-xs">
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      {/* Main Layout Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Category Header */}
        <div className="border-b border-neutral-200 pb-5 mb-6">
          <div className="flex items-center gap-2">
            {(() => {
              const config = categoryConfig[selectedCategory]
              const Icon = config?.icon || FiShoppingBag
              return <Icon className="w-5 h-5 md:w-6 md:h-6 text-neutral-700" />
            })()}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950">
              {getCategoryDisplayName(selectedCategory)}
            </h1>
            <span className="text-sm text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full ml-2">
              {filteredProducts.length}
            </span>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="w-full sm:max-w-xs relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition"
            >
              <FiFilter className="text-neutral-500" />
              <span>Categories</span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Max Price:</span>
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                className="w-32 accent-neutral-900"
              />
              <span className="text-xs font-mono font-medium text-neutral-900">₹{priceRange.max.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Split Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 xl:w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-neutral-200 p-4">
              {renderSidebarLinks()}
            </div>
          </aside>

          {/* Products Grid Area */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 border border-neutral-200 rounded-xl bg-neutral-50/50 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                      <FiSearch className="w-6 h-6 text-neutral-400" />
                    </div>
                    <p className="text-base font-semibold text-neutral-800">No products found</p>
                    <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filters</p>
                    <button
                      onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setPriceRange({ min: 0, max: 100000 }); }}
                      className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, idx) => (
                      <motion.div
                        key={product.id || product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Filter Sidebar Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden flex flex-col"
            >
              <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-neutral-900">Categories</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 rounded-xl hover:bg-neutral-100">
                  <FiX className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {renderSidebarLinks()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Peripherals