// src/pages/ProductList.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'
import ProductCard from '../components/Common/ProductCard'
import {
  FiSearch, FiCpu, FiLayers, FiZap, FiWind, FiPackage,
  FiDatabase, FiHardDrive, FiGrid, FiFilter, FiX,
  FiChevronRight, FiShoppingBag, FiArrowUp, FiArrowDown,
  FiMonitor, FiHeadphones, FiBox, FiTool
} from 'react-icons/fi'
import { FaKeyboard, FaMouse } from 'react-icons/fa'
import { MdGamepad } from 'react-icons/md'

const ProductList = ({ pageType }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 })
  const [sortBy, setSortBy] = useState('default')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Page configurations
  const pageConfigs = {
    products: {
      title: 'Gaming PC Components',
      subtitle: 'Premium components from top brands. Engineered for performance, built to last.',
      badge: '🖥️ PC COMPONENTS',
      path: '/products',
      categories: [
        { key: 'all', name: 'All Products', icon: FiGrid },
        { key: 'MOTHERBOARD', name: 'Motherboards', icon: FiLayers },
        { key: 'CPU', name: 'Processors', icon: FiCpu },
        { key: 'GPU', name: 'Graphics Cards', icon: FiZap },
        { key: 'RAM', name: 'Memory', icon: FiLayers },
        { key: 'PSU', name: 'Power Supplies', icon: FiZap },
        { key: 'STORAGE_NVME', name: 'NVMe SSDs', icon: FiDatabase },
        { key: 'STORAGE_SATA', name: 'SATA SSDs', icon: FiDatabase },
        { key: 'STORAGE_HDD', name: 'Hard Drives', icon: FiHardDrive },
        { key: 'COOLING', name: 'Cooling', icon: FiWind },
        { key: 'CASE', name: 'Cases', icon: FiPackage },
      ],
      categoryKeys: ['MOTHERBOARD', 'CPU', 'GPU', 'RAM', 'PSU', 'STORAGE_NVME', 'STORAGE_SATA', 'STORAGE_HDD', 'COOLING', 'CASE'],
      navLinks: [
        { label: 'Peripherals', path: '/peripherals', icon: FiHeadphones },
        { label: 'Accessories', path: '/accessories', icon: FiBox },
      ]
    },
    peripherals: {
      title: 'Gaming Peripherals',
      subtitle: 'Equip your setup with high-performance gaming peripherals',
      badge: '🎮 GAMING PERIPHERALS',
      path: '/peripherals',
      categories: [
        { key: 'all', name: 'All Peripherals', icon: FiGrid },
        { key: 'KEYBOARD', name: 'Keyboards', icon: FaKeyboard },
        { key: 'MOUSE', name: 'Mice', icon: FaMouse },
        { key: 'HEADPHONE', name: 'Headphones', icon: FiHeadphones },
        { key: 'MONITOR', name: 'Monitors', icon: FiMonitor },
        { key: 'MICROPHONE', name: 'Microphones', icon: FiHeadphones },
        { key: 'WEBCAM', name: 'Webcams', icon: FiMonitor },
        { key: 'SPEAKER', name: 'Speakers', icon: FiHeadphones },
        { key: 'CONTROLLER', name: 'Controllers', icon: MdGamepad },
        { key: 'MOUSE_PAD', name: 'Mouse Pads', icon: FiBox },
      ],
      categoryKeys: ['KEYBOARD', 'MOUSE', 'HEADPHONE', 'MONITOR', 'MICROPHONE', 'WEBCAM', 'SPEAKER', 'CONTROLLER', 'MOUSE_PAD'],
      navLinks: [
        { label: 'PC Components', path: '/products', icon: FiCpu },
        { label: 'Accessories', path: '/accessories', icon: FiBox },
      ]
    },
    accessories: {
      title: 'PC Accessories',
      subtitle: 'Essential upgrades and add-ons for your PC setup',
      badge: '🔧 PC ACCESSORIES',
      path: '/accessories',
      categories: [
        { key: 'all', name: 'All Accessories', icon: FiGrid },
        { key: 'THERMAL_PASTE', name: 'Thermal Paste', icon: FiTool },
        { key: 'CABLE_MANAGEMENT', name: 'Cable Management', icon: FiBox },
        { key: 'MONITOR_ARM', name: 'Monitor Arms', icon: FiMonitor },
        { key: 'USB_HUB', name: 'USB Hubs', icon: FiBox },
        { key: 'CAPTURE_CARD', name: 'Capture Cards', icon: FiBox },
        { key: 'DESK_MAT', name: 'Desk Mats', icon: FiBox },
        { key: 'UPS', name: 'UPS', icon: FiZap },
        { key: 'POWER_STRIP', name: 'Power Strips', icon: FiZap },
        { key: 'EXTERNAL_SSD', name: 'External SSDs', icon: FiDatabase },
      ],
      categoryKeys: ['THERMAL_PASTE', 'CABLE_MANAGEMENT', 'MONITOR_ARM', 'USB_HUB', 'CAPTURE_CARD', 'DESK_MAT', 'UPS', 'POWER_STRIP', 'EXTERNAL_SSD'],
      navLinks: [
        { label: 'PC Components', path: '/products', icon: FiCpu },
        { label: 'Peripherals', path: '/peripherals', icon: FiHeadphones },
      ]
    }
  }

  const config = pageConfigs[pageType]
  const sidebarCategories = config.categories

  // Read category from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const categoryParam = searchParams.get('category')
    
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
    } else if (!categoryParam && selectedCategory !== 'all') {
      setSelectedCategory('all')
    }
  }, [location.search])

  // Fetch products
  const { data: allProducts, isLoading } = useQuery({
    queryKey: [pageType, selectedCategory],
    queryFn: async () => {
      if (selectedCategory === 'all') {
        // Fetch all products and filter client-side
        const all = await productService.getAllProducts()
        return all.filter(p => config.categoryKeys.includes(p.category))
      }
      return productService.getProductsByCategory(selectedCategory)
    },
    staleTime: 5 * 60 * 1000,
  })

  // Update max price
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const maxPrice = Math.max(...allProducts.map(p => p.price || 0))
      setPriceRange(prev => ({ ...prev, max: maxPrice || 500000 }))
    }
  }, [allProducts])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!allProducts) return []
    
    let filtered = [...allProducts]
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    
    filtered = filtered.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    )
    
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name_asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name_desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name))
    }
    
    return filtered
  }, [allProducts, selectedCategory, searchTerm, priceRange, sortBy])

  const currentCategory = sidebarCategories.find(c => c.key === selectedCategory) || sidebarCategories[0]
  const CategoryIcon = currentCategory.icon

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
  ]

  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey)
    setIsMobileFilterOpen(false)
    setPriceRange({ min: 0, max: 500000 })
    
    if (categoryKey === 'all') {
      navigate(config.path)
    } else {
      navigate(`${config.path}?category=${categoryKey}`)
    }
  }

  const handleNavigateTo = (path) => {
    navigate(path)
    setIsMobileFilterOpen(false)
  }

  const renderSidebarLinks = () => (
    <nav className="space-y-1">
      {sidebarCategories.map((cat) => {
        const Icon = cat.icon
        const isActive = selectedCategory === cat.key
        return (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              isActive
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
            <span className="flex-1">{cat.name}</span>
            {isActive && <FiChevronRight className="w-3 h-3" />}
          </button>
        )
      })}
      
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-3 mb-2">
          Browse More
        </div>
        {config.navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => handleNavigateTo(link.path)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <link.icon className="w-4 h-4 text-neutral-400" />
            <span className="flex-1">{link.label}</span>
            <FiChevronRight className="w-3 h-3 text-neutral-400" />
          </button>
        ))}
      </div>
    </nav>
  )

  if (isLoading && !allProducts) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 border-t-neutral-900"></div>
          <p className="mt-3 text-neutral-500 text-sm">Loading {pageType}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-slate-800/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/50 text-slate-400 border border-slate-700/50 mb-5 tracking-wider uppercase">
            {config.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            {config.title}
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>
          <p className="text-slate-500 font-mono text-xs mt-4">
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Category Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-5 mb-6 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <CategoryIcon className="w-5 h-5 text-neutral-500" />
            <h1 className="text-xl font-semibold text-neutral-900">
              {currentCategory.name}
            </h1>
            <span className="text-sm text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
              {filteredProducts.length}
            </span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          <div className="relative w-full lg:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs text-neutral-500">Max Price:</span>
              <input
                type="range"
                min="0"
                max="500000"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                className="w-32 accent-neutral-900"
              />
              <span className="text-xs font-medium text-neutral-900">₹{priceRange.max.toLocaleString()}</span>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50"
            >
              <FiFilter className="text-neutral-500" size={14} />
              <span>Filter & Sort</span>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Categories</h3>
              {renderSidebarLinks()}
            </div>
          </aside>

          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 border border-neutral-200 rounded-xl bg-neutral-50">
                <div className="w-12 h-12 mx-auto mb-3 bg-neutral-100 rounded-full flex items-center justify-center">
                  <FiSearch className="w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-neutral-600 font-medium">No products found</p>
                <p className="text-neutral-400 text-sm mt-1">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearchTerm(''); handleCategoryChange('all'); setPriceRange({ min: 0, max: 500000 }); setSortBy('default'); }}
                  className="mt-4 text-sm text-neutral-600 hover:text-neutral-900 underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter */}
      {isMobileFilterOpen && (
        <>
          <div onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 lg:hidden flex flex-col">
            <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="font-semibold text-neutral-900">Filters & Sort</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-lg hover:bg-neutral-100">
                <FiX className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Sort By</h3>
                <div className="space-y-2">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setIsMobileFilterOpen(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        sortBy === option.value ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Max Price</h3>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full accent-neutral-900"
                />
                <div className="text-sm font-semibold text-neutral-900 mt-2">₹{priceRange.max.toLocaleString()}</div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Categories</h3>
                {renderSidebarLinks()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductList