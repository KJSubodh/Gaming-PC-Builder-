// src/pages/PreBuiltPC.jsx
import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiCpu, FiMonitor, FiShoppingCart,
  FiCheckCircle, FiArrowRight, FiFilter, FiX, FiHeart,
  FiGrid, FiTrendingUp, FiChevronRight, FiChevronLeft,
  FiShield, FiTruck, FiRefreshCw, FiPlus, FiMinus, FiSearch
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'

// Import local images - using correct path with backticks or quotes
const img1080p1 = new URL('../assets/PreBuilt PC/1080p Gaming 1.jpg', import.meta.url).href
const img1080p2 = new URL('../assets/PreBuilt PC/1080p Gaming 2.jpg', import.meta.url).href
const img1080p3 = new URL('../assets/PreBuilt PC/1080p Gaming 3.jpg', import.meta.url).href
const img1440p1 = new URL('../assets/PreBuilt PC/1440p Gaming 1.jpg', import.meta.url).href
const img1440p2 = new URL('../assets/PreBuilt PC/1440p Gaming 2.jpg', import.meta.url).href
const img1440p3 = new URL('../assets/PreBuilt PC/1440p Gaming 3.jpg', import.meta.url).href
const img4k1 = new URL('../assets/PreBuilt PC/4k Gaming 1.jpg', import.meta.url).href
const img4k2 = new URL('../assets/PreBuilt PC/4k Gaming 2.jpg', import.meta.url).href
const img4k3 = new URL('../assets/PreBuilt PC/4k Gaming 3.jpg', import.meta.url).href

const preBuiltConfigs = [
  // ============ 1080p Gaming ============
  {
    id: 1,
    name: "1080p Gaming PC - RTX 4060",
    price: 65000,
    image: img1080p1,
    description: "Perfect for competitive 1080p gaming with high FPS. This build delivers exceptional performance in esports titles.",
    resolution: "1080p",
    fps: "150+ FPS",
    gpuBrand: "nvidia",
    cpuBrand: "intel",
    specs: {
      cpu: "Intel Core i5-13400F",
      gpu: "NVIDIA RTX 4060",
      ram: "16GB DDR5",
      storage: "1TB NVMe SSD",
      psu: "650W Bronze",
      motherboard: "B760M"
    },
    performance: "150+ FPS in Competitive Games",
    games: ["Valorant", "CS2", "Fortnite", "Apex Legends", "Overwatch 2"],
  },
  {
    id: 2,
    name: "1080p Gaming PC - RX 7600",
    price: 62000,
    image: img1080p2,
    description: "AMD-powered 1080p gaming machine for esports enthusiasts. Pure performance at an unbeatable value.",
    resolution: "1080p",
    fps: "140+ FPS",
    gpuBrand: "amd",
    cpuBrand: "amd",
    specs: {
      cpu: "AMD Ryzen 5 7600X",
      gpu: "AMD RX 7600",
      ram: "16GB DDR5",
      storage: "1TB NVMe SSD",
      psu: "650W Bronze",
      motherboard: "B650M"
    },
    performance: "140+ FPS in Competitive Games",
    games: ["Valorant", "CS2", "Fortnite", "Rainbow Six", "Rocket League"],
  },
  {
    id: 3,
    name: "1080p Gaming PC - Arc A750",
    price: 58000,
    image: img1080p3,
    description: "Budget-friendly 1080p gaming with Intel Arc graphics. Great entry point for PC gaming.",
    resolution: "1080p",
    fps: "130+ FPS",
    gpuBrand: "intel",
    cpuBrand: "intel",
    specs: {
      cpu: "Intel Core i5-12400F",
      gpu: "Intel Arc A750",
      ram: "16GB DDR4",
      storage: "512GB NVMe SSD",
      psu: "600W Bronze",
      motherboard: "B660M"
    },
    performance: "130+ FPS in Competitive Games",
    games: ["Valorant", "CS2", "Fortnite", "Dota 2", "League of Legends"],
  },
  // ============ 1440p Gaming ============
  {
    id: 4,
    name: "1440p Gaming PC - RTX 4070 Super",
    price: 95000,
    image: img1440p1,
    description: "High-end 1440p gaming with NVIDIA RTX. Experience ultra settings at high refresh rates.",
    resolution: "1440p",
    fps: "120+ FPS",
    gpuBrand: "nvidia",
    cpuBrand: "amd",
    specs: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "NVIDIA RTX 4070 Super",
      ram: "32GB DDR5",
      storage: "2TB NVMe SSD",
      psu: "750W Gold",
      motherboard: "B650"
    },
    performance: "120+ FPS at 1440p Ultra Settings",
    games: ["Call of Duty", "Cyberpunk 2077", "Starfield", "Battlefield 2042", "Diablo IV"],
  },
  {
    id: 5,
    name: "1440p Gaming PC - RX 7800 XT",
    price: 88000,
    image: img1440p2,
    description: "Pure AMD 1440p gaming experience. Radeon RX graphics deliver exceptional performance.",
    resolution: "1440p",
    fps: "110+ FPS",
    gpuBrand: "amd",
    cpuBrand: "amd",
    specs: {
      cpu: "AMD Ryzen 7 7700X",
      gpu: "AMD RX 7800 XT",
      ram: "32GB DDR5",
      storage: "2TB NVMe SSD",
      psu: "750W Gold",
      motherboard: "B650"
    },
    performance: "110+ FPS at 1440p High Settings",
    games: ["Starfield", "Resident Evil 4", "Dead Space", "Hogwarts Legacy", "The Last of Us"],
  },
  {
    id: 6,
    name: "1440p Gaming PC - RTX 4070",
    price: 92000,
    image: img1440p3,
    description: "Intel-powered 1440p gaming powerhouse. The perfect balance of performance and value.",
    resolution: "1440p",
    fps: "115+ FPS",
    gpuBrand: "nvidia",
    cpuBrand: "intel",
    specs: {
      cpu: "Intel Core i7-13700KF",
      gpu: "NVIDIA RTX 4070",
      ram: "32GB DDR5",
      storage: "2TB NVMe SSD",
      psu: "750W Gold",
      motherboard: "Z790"
    },
    performance: "115+ FPS at 1440p High Settings",
    games: ["Cyberpunk 2077", "Call of Duty", "Battlefield", "Starfield", "Apex Legends"],
  },
  // ============ 4K Gaming ============
  {
    id: 7,
    name: "4K Gaming PC - RTX 4080 Super",
    price: 165000,
    image: img4k1,
    description: "Ultimate 4K gaming machine with RTX 4080 Super. Experience gaming at its finest.",
    resolution: "4k",
    fps: "100+ FPS",
    gpuBrand: "nvidia",
    cpuBrand: "intel",
    specs: {
      cpu: "Intel Core i9-13900KS",
      gpu: "NVIDIA RTX 4080 Super",
      ram: "64GB DDR5",
      storage: "4TB NVMe SSD",
      psu: "1000W Platinum",
      motherboard: "Z790"
    },
    performance: "100+ FPS at 4K Ultra Settings + DLSS 3",
    games: ["Cyberpunk 2077", "Alan Wake 2", "Starfield", "Avatar", "Everything 4K"],
  },
  {
    id: 8,
    name: "4K Gaming PC - RX 7900 XTX",
    price: 155000,
    image: img4k2,
    description: "AMD 4K gaming powerhouse with Radeon RX 7900 XTX. Pure AMD performance.",
    resolution: "4k",
    fps: "95+ FPS",
    gpuBrand: "amd",
    cpuBrand: "amd",
    specs: {
      cpu: "AMD Ryzen 9 7950X3D",
      gpu: "AMD RX 7900 XTX",
      ram: "64GB DDR5",
      storage: "4TB NVMe SSD",
      psu: "1000W Platinum",
      motherboard: "X670E"
    },
    performance: "95+ FPS at 4K High Settings",
    games: ["Cyberpunk 2077", "Starfield", "Resident Evil 4", "The Last of Us", "Hogwarts Legacy"],
  },
  {
    id: 9,
    name: "4K Gaming PC - RTX 4090",
    price: 175000,
    image: img4k3,
    description: "The ultimate Intel + NVIDIA 4K gaming beast. Maximum performance for maximum gaming.",
    resolution: "4k",
    fps: "105+ FPS",
    gpuBrand: "nvidia",
    cpuBrand: "intel",
    specs: {
      cpu: "Intel Core i9-14900K",
      gpu: "NVIDIA RTX 4090",
      ram: "64GB DDR5",
      storage: "4TB NVMe SSD",
      psu: "1200W Platinum",
      motherboard: "Z790"
    },
    performance: "105+ FPS at 4K Ultra Settings + Ray Tracing",
    games: ["Everything 4K", "Cyberpunk 2077", "Alan Wake 2", "Starfield", "Forza Horizon 5"],
  }
]

const MAX_CONFIG_PRICE = Math.max(...preBuiltConfigs.map(c => c.price))

const resolutionCategories = [
  { key: 'all', name: 'All Builds', icon: FiGrid },
  { key: '1080p', name: '1080p Gaming', icon: FiMonitor },
  { key: '1440p', name: '1440p Gaming', icon: FiMonitor },
  { key: '4k', name: '4K Gaming', icon: FiMonitor },
]

const gpuFilters = [
  { key: 'all', label: 'All GPUs' },
  { key: 'nvidia', label: 'NVIDIA' },
  { key: 'amd', label: 'AMD' },
]

const cpuFilters = [
  { key: 'all', label: 'All CPUs' },
  { key: 'intel', label: 'Intel' },
  { key: 'amd', label: 'AMD' },
]

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
]

const PreBuiltPC = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResolution, setSelectedResolution] = useState('all')
  const [selectedGPU, setSelectedGPU] = useState('all')
  const [selectedCPU, setSelectedCPU] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: MAX_CONFIG_PRICE })
  const [sortBy, setSortBy] = useState('default')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [selectedBuild, setSelectedBuild] = useState(null)
  const [quantity, setQuantity] = useState(1)

  // Filter and sort builds
  const filteredBuilds = useMemo(() => {
    let filtered = [...preBuiltConfigs]

    if (selectedResolution !== 'all') {
      filtered = filtered.filter(b => b.resolution === selectedResolution)
    }
    if (selectedGPU !== 'all') {
      filtered = filtered.filter(b => b.gpuBrand === selectedGPU)
    }
    if (selectedCPU !== 'all') {
      filtered = filtered.filter(b => b.cpuBrand === selectedCPU)
    }

    filtered = filtered.filter(b => b.price >= priceRange.min && b.price <= priceRange.max)

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.specs?.cpu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.specs?.gpu?.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [selectedResolution, selectedGPU, selectedCPU, searchTerm, priceRange, sortBy])

  const currentCategory = resolutionCategories.find(c => c.key === selectedResolution) || resolutionCategories[0]
  const CategoryIcon = currentCategory.icon

  const handleAddToCart = async (build) => {
    try {
      await addToCart(build.id, quantity)
      toast.success(`${build.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedResolution('all')
    setSelectedGPU('all')
    setSelectedCPU('all')
    setPriceRange({ min: 0, max: MAX_CONFIG_PRICE })
    setSortBy('default')
    setIsMobileFilterOpen(false)
  }

  const handleResolutionChange = (key) => {
    setSelectedResolution(key)
    setIsMobileFilterOpen(false)
  }

  const getGPUColor = (brand) => {
    if (brand === 'nvidia') return 'text-green-600'
    if (brand === 'amd') return 'text-red-600'
    return 'text-blue-600'
  }

  const getGPUName = (brand) => {
    if (brand === 'nvidia') return 'NVIDIA'
    if (brand === 'amd') return 'AMD'
    return 'Intel'
  }

  const getResolutionBadge = (resolution) => {
    const colors = {
      '1080p': 'bg-blue-100 text-blue-700 border-blue-200',
      '1440p': 'bg-purple-100 text-purple-700 border-purple-200',
      '4k': 'bg-amber-100 text-amber-700 border-amber-200'
    }
    return colors[resolution] || 'bg-neutral-100 text-neutral-700 border-neutral-200'
  }

  const renderSidebar = () => (
    <nav className="space-y-1">
      {resolutionCategories.map((cat) => {
        const Icon = cat.icon
        const isActive = selectedResolution === cat.key
        return (
          <button
            key={cat.key}
            onClick={() => handleResolutionChange(cat.key)}
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
          GPU Brand
        </div>
        <div className="flex flex-wrap gap-1.5 px-3">
          {gpuFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedGPU(f.key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedGPU === f.key
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-3 mb-2">
          CPU Brand
        </div>
        <div className="flex flex-wrap gap-1.5 px-3">
          {cpuFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedCPU(f.key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCPU === f.key
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <button
          onClick={() => navigate('/pc-builder')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        >
          <FiCpu className="w-4 h-4 text-neutral-400" />
          <span className="flex-1">Build Your Own PC</span>
          <FiChevronRight className="w-3 h-3 text-neutral-400" />
        </button>
      </div>
    </nav>
  )

  // Render Product Detail View
  if (selectedBuild) {
    const specifications = [
      { label: 'CPU', value: selectedBuild.specs.cpu },
      { label: 'GPU', value: selectedBuild.specs.gpu },
      { label: 'RAM', value: selectedBuild.specs.ram },
      { label: 'Storage', value: selectedBuild.specs.storage },
      { label: 'PSU', value: selectedBuild.specs.psu },
      { label: 'Motherboard', value: selectedBuild.specs.motherboard },
      { label: 'Resolution', value: `${selectedBuild.resolution} • ${selectedBuild.fps}` },
    ]

    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-neutral-50 border-b border-neutral-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Link to="/" className="hover:text-purple-600">Home</Link>
              <span>/</span>
              <button onClick={() => setSelectedBuild(null)} className="hover:text-purple-600">Pre-Built PCs</button>
              <span>/</span>
              <span className="text-neutral-900 font-medium">{selectedBuild.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSelectedBuild(null)}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6 transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" /> Back to Pre-Built PCs
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image */}
            <div>
              <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200">
                <img
                  src={selectedBuild.image}
                  alt={selectedBuild.name}
                  className="w-full h-auto object-contain max-h-[500px]"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border bg-white/90 ${getResolutionBadge(selectedBuild.resolution)}`}>
                  {selectedBuild.resolution} • {selectedBuild.fps}
                </span>
              </div>
            </div>

            {/* Right Column - Info */}
            <div>
              <div className="mb-4">
                <p className="text-sm text-purple-600 font-medium uppercase tracking-wide mb-1">
                  {getGPUName(selectedBuild.gpuBrand)} • {selectedBuild.cpuBrand === 'intel' ? 'Intel' : 'AMD'} Build
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{selectedBuild.name}</h1>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-neutral-900">₹{selectedBuild.price.toLocaleString()}</span>
              </div>

              <p className="text-neutral-600 text-sm leading-relaxed mb-6">{selectedBuild.description}</p>

              <p className="text-xs text-green-600 font-medium mb-6">✓ {selectedBuild.performance}</p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {selectedBuild.games.map(game => (
                  <span key={game} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                    {game}
                  </span>
                ))}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-neutral-700">Quantity:</span>
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 border-r border-neutral-300 hover:bg-neutral-50 transition"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 border-l border-neutral-300 hover:bg-neutral-50 transition"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => handleAddToCart(selectedBuild)}
                  className="flex-1 bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2"
                >
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
                <button className="px-5 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition">
                  <FiHeart size={18} className="text-neutral-600" />
                </button>
              </div>

              {/* Features */}
              <div className="border-t border-neutral-200 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                      <FiTruck className="text-neutral-600" size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Free Shipping</p>
                      <p className="text-[10px] text-neutral-500">On orders over ₹50,000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                      <FiShield className="text-neutral-600" size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Secure Payment</p>
                      <p className="text-[10px] text-neutral-500">100% protected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                      <FiRefreshCw className="text-neutral-600" size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Easy Returns</p>
                      <p className="text-[10px] text-neutral-500">7-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="text-base font-semibold text-neutral-900 mb-4">Technical Specifications</h3>
                <div className="space-y-2 text-sm">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex py-1.5 border-b border-neutral-100">
                      <span className="w-32 text-neutral-500">{spec.label}</span>
                      <span className="text-neutral-900 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main List View
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-slate-800/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/50 text-slate-400 border border-slate-700/50 mb-5 tracking-wider uppercase">
            🖥️ PRE-BUILT PCS
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Pre-Built Gaming PCs
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Professionally built, tested, and ready to ship. Choose your perfect gaming companion.
          </p>
          <p className="text-slate-500 font-mono text-xs mt-4">
            {filteredBuilds.length} builds found
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
              {filteredBuilds.length}
            </span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          <div className="relative w-full lg:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
            <input
              type="text"
              placeholder="Search builds..."
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
                max={MAX_CONFIG_PRICE}
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
              {renderSidebar()}
            </div>
          </aside>

          <main className="flex-1">
            {filteredBuilds.length === 0 ? (
              <div className="text-center py-16 border border-neutral-200 rounded-xl bg-neutral-50">
                <div className="w-12 h-12 mx-auto mb-3 bg-neutral-100 rounded-full flex items-center justify-center">
                  <FiSearch className="w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-neutral-600 font-medium">No builds found</p>
                <p className="text-neutral-400 text-sm mt-1">Try adjusting your search or filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-sm text-neutral-600 hover:text-neutral-900 underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBuilds.map((build) => (
                  <div
                    key={build.id}
                    className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedBuild(build)}
                  >
                    {/* Image Container */}
                    <div className="relative h-44 overflow-hidden bg-neutral-100">
                      <img
                        src={build.image}
                        alt={build.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border bg-white/90 backdrop-blur-sm ${getResolutionBadge(build.resolution)}`}>
                          {build.resolution} • {build.fps}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 flex gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold bg-white/90 backdrop-blur-sm shadow-sm ${getGPUColor(build.gpuBrand)}`}>
                          {getGPUName(build.gpuBrand)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold bg-white/90 backdrop-blur-sm shadow-sm ${build.cpuBrand === 'intel' ? 'text-blue-600' : 'text-red-600'}`}>
                          {build.cpuBrand === 'intel' ? 'Intel' : 'AMD'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-neutral-900 mb-1 truncate">{build.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
                        <FiCpu className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                        <span className="truncate">{build.specs.cpu.split(' ').slice(0, 2).join(' ')}</span>
                        <span className="text-neutral-300">•</span>
                        <FiMonitor className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                        <span className="truncate">{build.specs.gpu.split(' ').slice(0, 2).join(' ')}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                        <span className="text-lg font-bold text-neutral-900">₹{build.price.toLocaleString()}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddToCart(build)
                          }}
                          className="w-9 h-9 flex items-center justify-center border border-neutral-300 rounded-lg hover:bg-neutral-900 hover:border-neutral-900 hover:text-white text-neutral-700 transition-colors"
                          aria-label="Add to cart"
                        >
                          <FiShoppingCart size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16 bg-neutral-50 rounded-2xl p-6 md:p-8 border border-neutral-200">
          <h2 className="text-2xl font-bold text-center text-neutral-900 mb-8">Why Choose Our Pre-Built PCs?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
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
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTrendingUp className="text-amber-600 text-xl" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">Performance Tested</h3>
              <p className="text-xs text-neutral-500">Benchmarked and optimized</p>
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
                  max={MAX_CONFIG_PRICE}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full accent-neutral-900"
                />
                <div className="text-sm font-semibold text-neutral-900 mt-2">₹{priceRange.max.toLocaleString()}</div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Categories</h3>
                {renderSidebar()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PreBuiltPC