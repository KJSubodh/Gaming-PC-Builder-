import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiX, FiArrowRight, FiTrendingUp, FiClock, FiTag, FiShoppingBag, FiCpu, FiHardDrive, FiDatabase, FiMonitor, FiMousePointer, FiBox, FiWind } from 'react-icons/fi'
import { productService } from "../../services/productService";
import { motion, AnimatePresence } from 'framer-motion'

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'

const getImageUrl = (img) => {
  if (!img) return null
  const url = img?.url ?? img
  if (!url) return null
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`
}

// Intelligent category mapping for natural language search
const CATEGORY_MAPPING = {
  cpu: ['CPU', 'PROCESSOR', 'MICROPROCESSOR', 'CHIP', 'INTEL', 'AMD', 'RYZEN', 'CORE', 'I3', 'I5', 'I7', 'I9', 'THREADRIPPER'],
  gpu: ['GPU', 'GRAPHICS', 'VIDEO CARD', 'GRAPHICS CARD', 'NVIDIA', 'GEFORCE', 'RTX', 'GTX', 'AMD', 'RADEON', 'RX', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090'],
  ram: ['RAM', 'MEMORY', 'DDR', 'DDR4', 'DDR5', 'DRAM', 'STICKS', 'Corsair Vengeance', 'G.Skill', 'HyperX'],
  motherboard: ['MOTHERBOARD', 'MOBO', 'MAINBOARD', 'BOARD', 'Z790', 'B760', 'X670', 'B650', 'Z690', 'B660', 'MSI', 'ASUS', 'GIGABYTE', 'ASROCK'],
  storage: ['STORAGE', 'SSD', 'NVME', 'NVME SSD', 'M.2', 'SATA', 'HARD DRIVE', 'HDD', 'INTERNAL DRIVE', 'EXTERNAL DRIVE', 'SAMSUNG SSD', 'WD SSD', 'CRUCIAL'],
  psu: ['PSU', 'POWER SUPPLY', 'POWER SUPPLY UNIT', 'SMPS', 'POWER UNIT', 'Corsair PSU', 'EVGA', 'SEASONIC', 'COOLER MASTER'],
  case: ['CASE', 'CABINET', 'PC CASE', 'TOWER', 'CHASSIS', 'COMPUTER CASE', 'GAMING CASE', 'MID TOWER', 'FULL TOWER', 'Lian Li', 'NZXT', 'Corsair', 'FRACTAL'],
  cooling: ['COOLER', 'COOLING', 'CPU COOLER', 'FAN', 'AIO', 'LIQUID COOLER', 'AIR COOLER', 'RADIATOR', 'WATER COOLER', 'NOCTUA', 'be quiet', 'DEEPCOOL'],
  monitor: ['MONITOR', 'DISPLAY', 'SCREEN', 'GAMING MONITOR', 'LCD', 'LED', 'IPS', 'VA', 'TN', 'BENQ', 'LG', 'DELL', 'ACER', 'VIEWSONIC'],
  mouse: ['MOUSE', 'GAMING MOUSE', 'WIRELESS MOUSE', 'LOGITECH', 'RAZER', 'STEELSERIES', 'HYPERX', 'ZOWIE'],
  keyboard: ['KEYBOARD', 'MECHANICAL KEYBOARD', 'GAMING KEYBOARD', 'WIRELESS KEYBOARD', 'LOGITECH', 'RAZER', 'CORSAIR', 'KEYCHRON', 'DUCKY'],
  headphone: ['HEADPHONE', 'HEADPHONES', 'HEADSET', 'GAMING HEADSET', 'EARPHONE', 'EARPHONES', 'MICROPHONE', 'AUDIO', 'SPEAKER', 'STEELSERIES', 'HYPERX', 'RAZER', 'SENNHEISER'],
  accessory: ['ACCESSORY', 'ACCESSORIES', 'CABLE', 'EXTENSION', 'ADAPTER', 'HUB', 'DOCK', 'STAND', 'MOUSE PAD', 'MAT', 'BRACKET', 'MOUNT'],
}

const getActualCategory = (searchTerm) => {
  const upperTerm = searchTerm.toUpperCase().trim()
  
  for (const [actualCategory, keywords] of Object.entries(CATEGORY_MAPPING)) {
    if (keywords.some(keyword => upperTerm.includes(keyword) || keyword.includes(upperTerm))) {
      switch (actualCategory) {
        case 'cpu': return 'CPU'
        case 'gpu': return 'GPU'
        case 'ram': return 'RAM'
        case 'motherboard': return 'MOTHERBOARD'
        case 'storage': 
          if (upperTerm.includes('NVME') || upperTerm.includes('M.2')) return 'STORAGE_NVME'
          if (upperTerm.includes('SATA')) return 'STORAGE_SATA'
          if (upperTerm.includes('HDD') || upperTerm.includes('HARD DRIVE')) return 'STORAGE_HDD'
          return 'STORAGE_NVME'
        case 'psu': return 'PSU'
        case 'case': return 'CASE'
        case 'cooling': return 'COOLING'
        case 'monitor': return 'MONITOR'
        case 'mouse': return 'MOUSE'
        case 'keyboard': return 'KEYBOARD'
        case 'headphone': return 'HEADPHONE'
        case 'accessory': return 'ACCESSORY'
        default: return null
      }
    }
  }
  return null
}

const SearchBar = ({ onClose, isOpen = true }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [detectedCategory, setDetectedCategory] = useState(null)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse recent searches:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (searchQuery.trim()) {
      const category = getActualCategory(searchQuery)
      setDetectedCategory(category)
    } else {
      setDetectedCategory(null)
    }
  }, [searchQuery])

  const saveRecentSearch = (query) => {
    if (!query?.trim()) return
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleSearch = async (query) => {
    if (!query?.trim()) {
      setSearchResults([])
      return
    }
    
    setIsLoading(true)
    setShowSuggestions(false)
    
    try {
      const category = getActualCategory(query)
      let results = []
      
      if (category) {
        results = await productService.getProductsByCategory(category)
      }
      
      const textResults = await productService.searchProducts(query)
      
      const allResults = [...results, ...textResults]
      const uniqueResults = Array.from(
        new Map(allResults.map(p => [p.id, p])).values()
      )
      
      const sortedResults = uniqueResults.sort((a, b) => {
        const aExact = a.name?.toUpperCase().includes(query.toUpperCase())
        const bExact = b.name?.toUpperCase().includes(query.toUpperCase())
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return (b.salesCount || 0) - (a.salesCount || 0)
      })
      
      setSearchResults(sortedResults || [])
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery)
      } else {
        setSearchResults([])
        setShowSuggestions(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      const totalItems = searchResults.length
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % totalItems)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            handleResultClick(searchResults[selectedIndex].id)
          } else if (searchQuery.trim()) {
            handleViewAllResults()
          }
          break
        case 'Escape':
          onClose?.()
          break
        default:
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchResults, selectedIndex, searchQuery, isOpen])

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex]
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  const handleResultClick = (productId) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery)
    }
    onClose?.()
    navigate(`/product/${productId}`)
  }

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery)
    }
    onClose?.()
    const category = getActualCategory(searchQuery)
    if (category) {
      navigate(`/products?category=${encodeURIComponent(category)}`)
    } else {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowSuggestions(true)
    setSelectedIndex(-1)
    setDetectedCategory(null)
    inputRef.current?.focus()
  }

  const removeRecentSearch = (queryToRemove, e) => {
    e.stopPropagation()
    const updated = recentSearches.filter(q => q !== queryToRemove)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearAllRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const categorySuggestions = [
    { name: 'CPU', icon: FiCpu },
    { name: 'GPU', icon: FiCpu },
    { name: 'RAM', icon: FiDatabase },
    { name: 'Motherboard', icon: FiBox },
    { name: 'Storage', icon: FiHardDrive },
    { name: 'PSU', icon: FiBox },
    { name: 'Case', icon: FiBox },
    { name: 'Cooler', icon: FiWind },
    { name: 'Monitor', icon: FiMonitor },
    { name: 'Mouse', icon: FiMousePointer },
    { name: 'Keyboard', icon: FiMousePointer },
  ]

  const popularSearches = [
    'RTX 4070', 'Ryzen 7', 'DDR5 RAM', 'NVMe SSD', '850W PSU'
  ]

  const getCategoryBadgeStyle = (category) => {
    const styles = {
      CPU: 'bg-slate-700 text-slate-200',
      GPU: 'bg-slate-700 text-slate-200',
      RAM: 'bg-slate-700 text-slate-200',
      MOTHERBOARD: 'bg-slate-700 text-slate-200',
      STORAGE_NVME: 'bg-slate-700 text-slate-200',
      STORAGE_SATA: 'bg-slate-700 text-slate-200',
      STORAGE_HDD: 'bg-slate-700 text-slate-200',
      PSU: 'bg-slate-700 text-slate-200',
      CASE: 'bg-slate-700 text-slate-200',
      COOLING: 'bg-slate-700 text-slate-200',
      MONITOR: 'bg-slate-700 text-slate-200',
      MOUSE: 'bg-slate-700 text-slate-200',
      KEYBOARD: 'bg-slate-700 text-slate-200',
      HEADPHONE: 'bg-slate-700 text-slate-200',
    }
    return styles[category] || 'bg-slate-700 text-slate-200'
  }

  const getCategoryDisplayName = (category) => {
    const names = {
      CPU: 'CPU',
      GPU: 'GPU',
      RAM: 'RAM',
      MOTHERBOARD: 'Motherboard',
      STORAGE_NVME: 'NVMe SSD',
      STORAGE_SATA: 'SATA SSD',
      STORAGE_HDD: 'HDD',
      PSU: 'PSU',
      CASE: 'Case',
      COOLING: 'Cooler',
      MONITOR: 'Monitor',
      MOUSE: 'Mouse',
      KEYBOARD: 'Keyboard',
      HEADPHONE: 'Audio'
    }
    return names[category] || category?.split('_')[0] || 'Part'
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <FiSearch className="w-5 h-5 text-slate-500" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search components..."
          className="w-full pl-11 pr-11 py-3.5 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-slate-500 transition-all text-slate-100 placeholder:text-slate-500"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-slate-300 transition cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Detected Category Badge */}
      {detectedCategory && searchQuery && !isLoading && searchResults.length > 0 && (
        <div className="mt-3 flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">
            <FiTag className="w-3 h-3" />
            <span>Showing {getCategoryDisplayName(detectedCategory)}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="w-12 h-12 bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3.5 bg-slate-800 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-2.5 bg-slate-800 rounded w-1/3 animate-pulse"></div>
              </div>
              <div className="w-20 h-5 bg-slate-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      )}

      {/* Search Results */}
      {!isLoading && searchResults.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {detectedCategory ? getCategoryDisplayName(detectedCategory) : 'Products'}
            </span>
            <span className="text-xs text-slate-500">
              {searchResults.length} items
            </span>
          </div>

          <div ref={resultsRef} className="space-y-1 max-h-96 overflow-y-auto">
            {searchResults.slice(0, 8).map((product, idx) => {
              const imageUrl = product.images?.[0] ? getImageUrl(product.images[0]) : null
              const isSelected = idx === selectedIndex
              
              return (
                <button
                  key={product.id}
                  onClick={() => handleResultClick(product.id)}
                  className={`w-full cursor-pointer transition-colors duration-150 ${
                    isSelected ? 'scale-[1.01]' : ''
                  }`}
                >
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    isSelected 
                      ? 'bg-slate-800' 
                      : 'bg-slate-900/50 hover:bg-slate-800/80'
                  }`}>
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48'
                            e.target.onerror = null
                          }}
                        />
                      ) : (
                        <FiShoppingBag className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {product.brand && (
                          <span className="text-xs text-slate-500">
                            {product.brand}
                          </span>
                        )}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${getCategoryBadgeStyle(product.category)}`}>
                          {getCategoryDisplayName(product.category)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex-shrink-0 text-right">
                      <p className="font-medium text-slate-200 text-sm">
                        ₹{product.price?.toLocaleString()}
                      </p>
                      <span className="text-xs text-slate-500">
                        View →
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {searchResults.length > 8 && (
            <button
              onClick={handleViewAllResults}
              className="mt-3 w-full py-2 text-center cursor-pointer rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors duration-150"
            >
              <span className="text-xs font-medium text-slate-300">
                View All {searchResults.length} Results
              </span>
            </button>
          )}
        </div>
      )}

      {/* No Results */}
      {!isLoading && searchQuery && searchResults.length === 0 && (
        <div className="mt-8 text-center py-8">
          <div className="w-14 h-14 mx-auto mb-3 bg-slate-800 rounded-2xl flex items-center justify-center">
            <FiSearch className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-slate-300 font-medium text-sm">No results found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try different keywords
          </p>
          {detectedCategory && (
            <button
              onClick={() => navigate(`/products?category=${detectedCategory}`)}
              className="mt-4 text-xs text-slate-400 hover:text-slate-300 transition cursor-pointer"
            >
              Browse {getCategoryDisplayName(detectedCategory)} →
            </button>
          )}
        </div>
      )}

      {/* Suggestions Section */}
      {showSuggestions && !searchQuery && (
        <div className="mt-6 space-y-6">
          {/* Category Grid */}
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Browse by category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categorySuggestions.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSearchQuery(cat.name)
                      handleSearch(cat.name)
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm transition-colors duration-150 cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Popular Searches */}
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Trending
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term)
                    handleSearch(term)
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-slate-300 transition-colors duration-150 cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Recent
                </h3>
                <button
                  onClick={clearAllRecent}
                  className="text-xs text-slate-500 hover:text-slate-400 transition cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((query) => (
                  <button
                    key={query}
                    onClick={() => {
                      setSearchQuery(query)
                      handleSearch(query)
                    }}
                    className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-slate-300 transition-colors duration-150 cursor-pointer"
                  >
                    <FiSearch className="w-3 h-3 text-slate-500" />
                    <span>{query}</span>
                    <button
                      onClick={(e) => removeRecentSearch(query, e)}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                    >
                      <FiX className="w-2.5 h-2.5 text-slate-500 hover:text-red-400" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Tip */}
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              💡 Try: RTX 4070, Ryzen 7, DDR5 RAM, 850W PSU
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar