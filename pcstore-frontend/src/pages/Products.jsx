import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'
import ProductCard from '../components/Common/ProductCard'
import {
  FiSearch, FiCpu, FiLayers, FiZap, FiWind, FiPackage,
  FiDatabase, FiHardDrive, FiGrid, FiFilter, FiX,
  FiChevronRight, FiShoppingBag, FiArrowUp, FiArrowDown
} from 'react-icons/fi'

const Products = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 })
  const [sortBy, setSortBy] = useState('default')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Read category from URL on component mount and when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const categoryParam = searchParams.get('category')
    
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
    } else if (!categoryParam && selectedCategory !== 'all') {
      setSelectedCategory('all')
    }
  }, [location.search])

  // Fetch ALL products once
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => productService.getAllProducts(),
    staleTime: 5 * 60 * 1000,
  })

  // Update max price when products load
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
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'COOLING') {
        filtered = filtered.filter(p => 
          p.category === 'COOLING_CPU_AIR' || 
          p.category === 'COOLING_CPU_LIQUID' || 
          p.category === 'COOLING_FAN'
        )
      } else {
        filtered = filtered.filter(p => p.category === selectedCategory)
      }
    }
    
    // Apply price filter
    filtered = filtered.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    )
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply sorting
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

  // Category order priority
  const sidebarCategories = [
    { key: 'all', name: 'All Products', icon: FiGrid },
    { key: 'MOTHERBOARD', name: 'Motherboards', icon: FiLayers },
    { key: 'CPU', name: 'Processors', icon: FiCpu },
    { key: 'GPU', name: 'Graphics Cards', icon: FiZap },
    { key: 'RAM', name: 'Memory', icon: FiLayers },
    { key: 'PSU', name: 'Power Supplies', icon: FiZap },
    { key: 'STORAGE_NVME', name: 'NVMe SSDs', icon: FiDatabase },
    { key: 'STORAGE_SATA', name: 'SATA SSDs', icon: FiDatabase },
    { key: 'STORAGE_HDD', name: 'Hard Drives', icon: FiHardDrive },
    { key: 'MONITOR', name: 'Monitors', icon: FiPackage },
    { key: 'MOUSE', name: 'Mice', icon: FiShoppingBag },
    { key: 'KEYBOARD', name: 'Keyboards', icon: FiGrid },
  ]

  const categoryConfig = {
    all: { name: 'All Products', icon: FiGrid, tagline: 'Browse our entire catalog of premium components.' },
    MOTHERBOARD: { name: 'Motherboards', icon: FiLayers, tagline: 'Compatible socket foundations for your build.' },
    CPU: { name: 'Processors', icon: FiCpu, tagline: 'Desktop processors from Intel and AMD.' },
    GPU: { name: 'Graphics Cards', icon: FiZap, tagline: 'Dedicated graphics units for gaming and workstations.' },
    RAM: { name: 'Memory', icon: FiLayers, tagline: 'High-speed DDR4 and DDR5 memory kits.' },
    PSU: { name: 'Power Supplies', icon: FiZap, tagline: 'Efficient modular and non-modular power units.' },
    STORAGE_NVME: { name: 'NVMe SSDs', icon: FiDatabase, tagline: 'Ultra-fast PCIe storage.' },
    STORAGE_SATA: { name: 'SATA SSDs', icon: FiDatabase, tagline: 'Reliable solid state storage.' },
    STORAGE_HDD: { name: 'Hard Drives', icon: FiHardDrive, tagline: 'High capacity mechanical storage.' },
    MONITOR: { name: 'Monitors', icon: FiPackage, tagline: 'High refresh rate displays for gaming.' },
    MOUSE: { name: 'Mice', icon: FiShoppingBag, tagline: 'Precision gaming mice.' },
    KEYBOARD: { name: 'Keyboards', icon: FiGrid, tagline: 'Mechanical and membrane keyboards.' },
  }

  const currentCategory = categoryConfig[selectedCategory] || categoryConfig.all
  const CategoryIcon = currentCategory.icon

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High', icon: FiArrowUp },
    { value: 'price_desc', label: 'Price: High to Low', icon: FiArrowDown },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
  ]

  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey)
    setIsMobileFilterOpen(false)
    setPriceRange({ min: 0, max: 500000 })
    
    if (categoryKey === 'all') {
      navigate('/products')
    } else {
      navigate(`/products?category=${categoryKey}`)
    }
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
    </nav>
  )

  if (isLoading && !allProducts) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 border-t-neutral-900"></div>
          <p className="mt-3 text-neutral-500 text-sm">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-b border-cyan-500/20">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-5 tracking-wider uppercase">
            PREMIUM PC COMPONENTS
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Gaming PC Components
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Premium components from top brands. Engineered for performance, built to last.
          </p>
          <p className="text-cyan-400 font-semibold text-sm mt-4">
            {filteredProducts.length} components found
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
          <p className="text-neutral-500 text-sm hidden md:block">{currentCategory.tagline}</p>
        </div>

        {/* Search & Filter Bar */}
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
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter - Desktop */}
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
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Categories
              </h3>
              {renderSidebarLinks()}
            </div>
          </aside>

          {/* Products Grid */}
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

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <>
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 lg:hidden flex flex-col">
            <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="font-semibold text-neutral-900">Filters & Sort</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100"
              >
                <FiX className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Sort Section */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Sort By</h3>
                <div className="space-y-2">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setIsMobileFilterOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        sortBy === option.value
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Section */}
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
                <div className="text-sm font-semibold text-neutral-900 mt-2">
                  ₹{priceRange.max.toLocaleString()}
                </div>
              </div>

              {/* Categories Section */}
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

export default Products