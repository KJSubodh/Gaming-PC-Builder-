import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiCheck, FiTruck, FiShield, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'
const getImageUrl = (img) => {
  const url = img?.url ?? img
  if (!url) return 'https://via.placeholder.com/100x100?text=No+Image'
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`
}

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading, refreshCart, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [isClearing, setIsClearing] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)

  useEffect(() => {
    refreshCart()
  }, [])

  const items = Array.isArray(cartItems) ? cartItems : []
  const total = getCartTotal ? getCartTotal() : 0
  // ✅ GST removed — no tax line
  const shipping = total > 50000 ? 0 : 500
  const grandTotal = total + shipping

  const handleClearCart = () => {
    setShowClearModal(true)
  }

  const confirmClearCart = async () => {
    setIsClearing(true)
    try {
      await clearCart()
      toast.success('Cart cleared')
      setShowClearModal(false)
    } catch (error) {
      console.error('Failed to clear cart:', error)
      toast.error('Failed to clear cart')
    } finally {
      setIsClearing(false)
    }
  }

  const handleCheckout = (e) => {
    if (!isAuthenticated) {
      e.preventDefault()
      sessionStorage.setItem('redirectAfterLogin', '/checkout')
      toast.error('Please login to proceed to checkout')
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 border-t-neutral-900"></div>
          <p className="mt-3 text-neutral-500 text-sm">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative overflow-hidden bg-slate-950 text-white py-16 border-b border-purple-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 tracking-wider uppercase">
              🛒 Your Cart
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
              Your Shopping Cart
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="text-4xl text-neutral-400" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
            <p className="text-neutral-500 mb-6">Looks like you haven't added any items yet</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              Continue Shopping <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-slate-950 text-white py-16 mb-8 border-b border-purple-500/10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 tracking-wider uppercase">
            🛒 Secure Checkout
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Review your items before proceeding to checkout
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-neutral-900">
                {items.length} item{items.length !== 1 ? 's' : ''} in cart
              </h2>
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-red-50"
                title="Clear all items from cart"
              >
                <FiTrash2 size={14} />
                Clear Cart
              </button>
            </div>

            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to={`/product/${item.productId || item.product_id || item.id}`} className="w-24 h-24 flex-shrink-0 bg-neutral-50 rounded-lg overflow-hidden">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'
                        }}
                      />
                    </Link>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <Link to={`/product/${item.productId || item.product_id || item.id}`}>
                            <h3 className="font-semibold text-neutral-900 text-lg hover:text-purple-600 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-neutral-500 mt-0.5">{item.brand || 'Premium Component'}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">In Stock</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-neutral-900">
                            ₹{item.price?.toLocaleString()}
                          </div>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            ₹{(item.price * item.quantity).toLocaleString()} total
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-neutral-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1.5 hover:bg-neutral-50 transition-colors"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1.5 hover:bg-neutral-50 transition-colors"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm"
                          >
                            <FiTrash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {items.length > 1 && (
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="w-full py-3 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer mt-4"
              >
                <FiTrash2 size={16} />
                Clear All {items.length} Items
              </button>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-neutral-200 p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Order Summary</h3>

                {/* ✅ Simplified — just subtotal + shipping */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-neutral-900">
                      <span>Total</span>
                      <span>₹{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FiTruck className="text-purple-600" />
                    <span className="text-purple-900 font-medium">Free Delivery</span>
                  </div>
                  <p className="text-xs text-purple-700 mt-1">Estimated delivery: 3-5 business days</p>
                </div>

                {isAuthenticated ? (
                  <Link
                    to="/checkout"
                    className="w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Proceed to Checkout
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Login to Checkout
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                <Link
                  to="/products"
                  className="w-full text-center mt-3 text-neutral-500 hover:text-neutral-700 text-sm transition-colors block"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <FiShield className="mx-auto text-neutral-400 mb-1" size={16} />
                      <p className="text-[10px] text-neutral-500">Secure<br />Payment</p>
                    </div>
                    <div>
                      <FiRefreshCw className="mx-auto text-neutral-400 mb-1" size={16} />
                      <p className="text-[10px] text-neutral-500">Easy<br />Returns</p>
                    </div>
                    <div>
                      <FiCheck className="mx-auto text-neutral-400 mb-1" size={16} />
                      <p className="text-[10px] text-neutral-500">Quality<br />Guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLEAR CART CONFIRMATION MODAL */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => !isClearing && setShowClearModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Clear entire cart?
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-1">
                  This will remove all <span className="font-semibold text-neutral-900">{items.length} item{items.length !== 1 ? 's' : ''}</span> from your cart.
                </p>
                <p className="text-xs text-neutral-400">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 p-5 bg-neutral-50 border-t border-neutral-200">
                <button
                  onClick={() => setShowClearModal(false)}
                  disabled={isClearing}
                  className="flex-1 px-5 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearCart}
                  disabled={isClearing}
                  className="flex-1 px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isClearing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      Clear Cart
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Cart