import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'
import { motion } from 'framer-motion'
import {
  FiArrowLeft, FiTruck, FiShield, FiClock, FiMapPin,
  FiPhone, FiMail, FiUser, FiFileText, FiCheck, FiCreditCard
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    shippingAddress: '',
    notes: ''
  })

  const total = getCartTotal()
  const tax = total * 0.18
  const shipping = total > 50000 ? 0 : 500
  const grandTotal = total + tax + shipping

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.customerName || !formData.customerPhone || !formData.shippingAddress) {
      toast.error('Please fill in all required fields')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        notes: formData.notes,
        items: cartItems.map(item => ({
          productId: item.product_id || item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: total,
        tax: tax,
        shipping: shipping,
        totalAmount: grandTotal
      }

      const response = await orderService.createOrder(orderData)
      toast.success('Order placed successfully!')
      clearCart()
      
      // Use the order number endpoint instead of ID
      navigate(`/orders/number/${response.orderNumber}`)
    } catch (error) {
      console.error('Order error:', error)
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-16 mb-8 border-b border-purple-500/10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <Link to="/cart" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors">
            <FiArrowLeft /> Back to Cart
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 tracking-wider uppercase">
            <FiCreditCard /> Secure Checkout
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Complete Your Order
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Review your items and fill in the details below
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <FiUser className="text-purple-600" />
                Shipping Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 text-neutral-400" size={18} />
                    <textarea
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none"
                      placeholder="Street Address, City, State, PIN Code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Order Notes
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-3 text-neutral-400" size={18} />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="2"
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none"
                      placeholder="Any special instructions for delivery"
                    />
                  </div>
                </div>
              </div>
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-20"
            >
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-neutral-200 p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Order Summary</h3>

                <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-2">
                  {cartItems.map((item, idx) => (
                    <div key={item.id || idx} className="flex justify-between text-sm py-2 border-b border-neutral-100">
                      <div className="flex-1">
                        <span className="font-medium text-neutral-900">{item.name}</span>
                        <span className="text-neutral-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-2">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-neutral-900">Total</span>
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        ₹{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="bg-purple-50 rounded-lg p-3 my-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FiTruck className="text-purple-600" />
                    <span className="text-purple-900 font-medium">Free Delivery</span>
                  </div>
                  <p className="text-xs text-purple-700 mt-1">Estimated delivery: 3-5 business days</p>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-between gap-2 mb-4 text-center">
                  <div className="flex-1">
                    <FiShield className="mx-auto text-neutral-400 mb-1" size={16} />
                    <p className="text-[10px] text-neutral-500">Secure<br />Payment</p>
                  </div>
                  <div className="flex-1">
                    <FiClock className="mx-auto text-neutral-400 mb-1" size={16} />
                    <p className="text-[10px] text-neutral-500">Easy<br />Returns</p>
                  </div>
                  <div className="flex-1">
                    <FiCheck className="mx-auto text-neutral-400 mb-1" size={16} />
                    <p className="text-[10px] text-neutral-500">Quality<br />Guarantee</p>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard /> Place Order • ₹{grandTotal.toLocaleString()}
                    </>
                  )}
                </button>

                <Link
                  to="/cart"
                  className="block text-center mt-3 text-neutral-500 hover:text-neutral-700 text-sm transition-colors"
                >
                  ← Return to Cart
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout