import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { FiShoppingCart, FiStar } from 'react-icons/fi'

// Image URL helper
const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'
const getImageUrl = (img) => {
  const url = img?.url ?? img
  if (!url) return 'https://via.placeholder.com/300x300?text=No+Image'
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`
}

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product.id, 1)
  }

  return (
    <Link to={`/product/${product.id}`} className="group block bg-white rounded-xl border border-gray-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Image Container with proper padding and aspect ratio */}
      <div className="relative bg-slate-50 p-4 flex items-center justify-center">
        <div className="w-full h-48 flex items-center justify-center">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
            }}
          />
        </div>
        
        {/* Stock Status Badges */}
        {product.stockQuantity < 10 && product.stockQuantity > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
            Low Stock
          </span>
        )}
        {product.stockQuantity === 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
            Out of Stock
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            {product.brand}
          </div>
        )}
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <FiStar 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(product.avgRating || 0) ? 'fill-current' : ''}`} 
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">
            ({product.reviewCount || 0})
          </span>
        </div>
        
        {/* Price and Cart Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through ml-2">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 cursor-pointer"
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard