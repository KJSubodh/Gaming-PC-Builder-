import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import { FiShoppingCart, FiHeart, FiStar, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'
const getImageUrl = (img) => {
  const url = img?.url ?? img
  if (!url) return 'https://via.placeholder.com/500'
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`
}

const ProductDetail = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id)
  })

  const handleAddToCart = async () => {
    const success = await addToCart(product.id, quantity)
    if (success) {
      setQuantity(1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 border-t-neutral-900"></div>
          <p className="mt-3 text-neutral-500 text-sm">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Product not found</p>
          <Link to="/products" className="mt-4 inline-block text-purple-600 hover:text-purple-700">Back to Products</Link>
        </div>
      </div>
    )
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0)
    return (
      <div className="flex gap-0.5 text-sm">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} className={`${i < fullStars ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
        ))}
      </div>
    )
  }

  // Define specification priority order
  const getSpecsInPriority = (product) => {
    const specMap = {
      socket: { label: 'Socket', value: product.socket },
      chipset: { label: 'Chipset', value: product.chipset },
      cores: { label: 'Cores / Threads', value: product.cores ? `${product.cores} / ${product.threads || '-'}` : null },
      base_clock: { label: 'Base Clock', value: product.base_clock ? `${product.base_clock} GHz` : null },
      boost_clock: { label: 'Boost Clock', value: product.boost_clock ? `${product.boost_clock} GHz` : null },
      integrated_graphics: { label: 'Integrated Graphics', value: product.integrated_graphic !== undefined ? (product.integrated_graphic ? 'Yes' : 'No') : null },
      vram: { label: 'VRAM', value: product.vram ? `${product.vram} GB` : null },
      vram_type: { label: 'VRAM Type', value: product.vram_type },
      ray_tracing: { label: 'Ray Tracing', value: product.ray_tracing !== undefined ? (product.ray_tracing ? 'Yes' : 'No') : null },
      ram_type: { label: 'Memory Type', value: product.ramType },
      ram_speed: { label: 'Memory Speed', value: product.ramSpeed ? `${product.ramSpeed} MHz` : null },
      ram_capacity: { label: 'Memory Capacity', value: product.ramCapacity ? `${product.ramCapacity} GB` : null },
      cas_latency: { label: 'CAS Latency', value: product.casLatency },
      wattage: { label: 'Power (Wattage)', value: product.wattage ? `${product.wattage}W` : null },
      efficiency: { label: 'Efficiency', value: product.efficiency },
      modular: { label: 'Modular', value: product.modular },
      form_factor: { label: 'Form Factor', value: product.formFactor },
      case_type: { label: 'Case Type', value: product.caseType },
      tempered_glass: { label: 'Tempered Glass', value: product.temperedGlass !== undefined ? (product.temperedGlass ? 'Yes' : 'No') : null },
      cooling_type: { label: 'Cooling Type', value: product.coolingType },
      fan_size: { label: 'Fan Size', value: product.fanSize ? `${product.fanSize}mm` : null },
      pwm: { label: 'PWM Support', value: product.pwm !== undefined ? (product.pwm ? 'Yes' : 'No') : null },
      rgb: { label: 'RGB Lighting', value: product.rgb !== undefined ? (product.rgb ? 'Yes' : 'No') : null },
      storage_type: { label: 'Storage Type', value: product.storageType },
      storage_capacity: { label: 'Storage Capacity', value: product.storageCapacity ? `${product.storageCapacity} GB` : null },
      storage_interface: { label: 'Interface', value: product.storageInterface },
      read_speed: { label: 'Read Speed', value: product.readSpeed ? `${product.readSpeed} MB/s` : null },
      write_speed: { label: 'Write Speed', value: product.writeSpeed ? `${product.writeSpeed} MB/s` : null },
      screen_size: { label: 'Screen Size', value: product.screenSize ? `${product.screenSize}"` : null },
      resolution: { label: 'Resolution', value: product.resolution },
      refresh_rate: { label: 'Refresh Rate', value: product.refreshRate ? `${product.refreshRate} Hz` : null },
      panel_type: { label: 'Panel Type', value: product.panelType },
      response_time: { label: 'Response Time', value: product.responseTime ? `${product.responseTime}ms` : null },
    }

    // Priority order for specifications
    const priorityOrder = [
      'socket', 'chipset', 'cores', 'base_clock', 'boost_clock', 'integrated_graphics',
      'vram', 'vram_type', 'ray_tracing',
      'ram_type', 'ram_speed', 'ram_capacity', 'cas_latency',
      'wattage', 'efficiency', 'modular',
      'form_factor', 'case_type', 'tempered_glass',
      'cooling_type', 'fan_size', 'pwm', 'rgb',
      'storage_type', 'storage_capacity', 'storage_interface', 'read_speed', 'write_speed',
      'screen_size', 'resolution', 'refresh_rate', 'panel_type', 'response_time'
    ]

    const orderedSpecs = []
    const usedKeys = new Set()

    // First add specs in priority order
    for (const key of priorityOrder) {
      if (specMap[key] && specMap[key].value !== null && specMap[key].value !== undefined && specMap[key].value !== '') {
        orderedSpecs.push(specMap[key])
        usedKeys.add(key)
      }
    }

    // Then add any remaining specs
    for (const [key, spec] of Object.entries(specMap)) {
      if (!usedKeys.has(key) && spec.value !== null && spec.value !== undefined && spec.value !== '') {
        orderedSpecs.push(spec)
      }
    }

    return orderedSpecs
  }

  const specifications = getSpecsInPriority(product)

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Link to="/" className="hover:text-purple-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-purple-600">Products</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200">
              <img
                src={getImageUrl(product.images?.[selectedImage])}
                alt={product.name}
                className="w-full h-auto object-contain max-h-[500px]"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-purple-600' : 'border-neutral-200 hover:border-purple-300'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div>
            {/* Brand & Name */}
            <div className="mb-4">
              <p className="text-sm text-purple-600 font-medium uppercase tracking-wide mb-1">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{product.name}</h1>
              <p className="text-sm text-neutral-500 mt-1">Model: {product.model || 'Standard'}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              {renderStars(product.avgRating)}
              <span className="text-sm text-neutral-500">({product.reviewCount || 0} reviews)</span>
              {product.stockQuantity > 0 && (
                <span className="text-sm text-green-600 font-medium ml-auto">✓ In Stock</span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-neutral-900">₹{product.price.toLocaleString()}</span>
              {product.stockQuantity > 0 && product.stockQuantity < 10 && (
                <p className="text-sm text-orange-500 mt-1">Only {product.stockQuantity} left in stock</p>
              )}
            </div>

            {/* Description */}
            <p className="text-neutral-600 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Quantity Selector */}
            {product.stockQuantity > 0 && (
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
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3 py-1.5 border-l border-neutral-300 hover:bg-neutral-50 transition"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1 bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            {/* Specifications - Now in Priority Order */}
            {specifications.length > 0 && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail