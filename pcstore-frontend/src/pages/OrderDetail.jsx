import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '../services/orderService'
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiPhone, FiMail, FiCreditCard, FiCalendar, FiUser } from 'react-icons/fi'

const OrderDetail = () => {
  const { id } = useParams()
  
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderByNumber(id)
  })

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <FiClock className="text-amber-400" />
      case 'PROCESSING': return <FiPackage className="text-blue-400" />
      case 'SHIPPED': return <FiTruck className="text-cyan-400" />
      case 'DELIVERED': return <FiCheckCircle className="text-green-400" />
      default: return <FiPackage className="text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      PROCESSING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      SHIPPED: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      DELIVERED: 'bg-green-500/10 text-green-400 border border-green-500/20',
      CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20'
    }
    return colors[status] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
  }

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'Pending Confirmation',
      PROCESSING: 'Processing',
      SHIPPED: 'Shipped',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled'
    }
    return texts[status] || status
  }

  const getStatusMessage = (status) => {
    switch(status) {
      case 'PENDING': return 'Your order has been received and is awaiting confirmation.'
      case 'PROCESSING': return 'Your order is being processed and packed for shipment.'
      case 'SHIPPED': return 'Your order has been shipped and is on its way to you!'
      case 'DELIVERED': return 'Your order has been delivered. We hope you enjoy your purchase!'
      default: return 'Order status update pending.'
    }
  }

  const getProgressWidth = (status) => {
    switch(status) {
      case 'PENDING': return 'w-1/4'
      case 'PROCESSING': return 'w-2/4'
      case 'SHIPPED': return 'w-3/4'
      case 'DELIVERED': return 'w-full'
      default: return 'w-0'
    }
  }

  const getProgressColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-500'
      case 'PROCESSING': return 'bg-blue-500'
      case 'SHIPPED': return 'bg-cyan-500'
      case 'DELIVERED': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative overflow-hidden bg-slate-950 py-20 mb-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="h-8 w-48 bg-slate-800 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 w-80 bg-slate-800 rounded-lg mx-auto mb-3 animate-pulse"></div>
            <div className="h-6 w-96 bg-slate-800 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative overflow-hidden bg-slate-950 text-white py-20 mb-8 border-b border-cyan-500/20">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 tracking-wider uppercase">
              <FiPackage className="w-3 h-3" /> Order Not Found
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-white">
              Order Not Found
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              The order you're looking for doesn't exist or has been removed
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 text-center">
          <Link 
            to="/orders" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - No Gradients */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-16 mb-6 border-b border-cyan-500/20">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 tracking-wider uppercase">
            <FiPackage className="w-3 h-3" /> Order Details
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Order Summary
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light mt-2">
            View complete details of your order
          </p>
        </div>
      </div>

      {/* Back Button - Black */}
      <div className="max-w-5xl mx-auto px-4 mb-4">
        <Link 
          to="/orders" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        {/* Order Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-mono">
                  #{order.orderNumber}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <FiCalendar className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.orderStatus)}
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                  {getStatusText(order.orderStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm text-gray-600">{getStatusMessage(order.orderStatus)}</p>
          </div>

          {/* Order Progress Bar */}
          {order.orderStatus !== 'CANCELLED' && (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Order Progress</span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {order.orderStatus === 'PENDING' && 'Step 1/4'}
                  {order.orderStatus === 'PROCESSING' && 'Step 2/4'}
                  {order.orderStatus === 'SHIPPED' && 'Step 3/4'}
                  {order.orderStatus === 'DELIVERED' && 'Completed'}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${getProgressColor(order.orderStatus)} ${getProgressWidth(order.orderStatus)}`}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] text-gray-400">Ordered</span>
                <span className="text-[9px] text-gray-400">Confirmed</span>
                <span className="text-[9px] text-gray-400">Shipped</span>
                <span className="text-[9px] text-gray-400">Delivered</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Order Items</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{item.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Order Timeline</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {order.orderStatus !== 'PENDING' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FiPackage className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                      <p className="text-xs text-gray-500">Order has been confirmed</p>
                    </div>
                  </div>
                )}
                {order.orderStatus === 'SHIPPED' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                      <FiTruck className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shipped</p>
                      <p className="text-xs text-gray-500">Your order is on the way</p>
                    </div>
                  </div>
                )}
                {order.orderStatus === 'DELIVERED' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                      <FiTruck className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivered</p>
                      <p className="text-xs text-gray-500">Order has been delivered</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Shipping */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiCreditCard className="w-4 h-4" />
                  Payment Summary
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">₹{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="text-gray-900">₹{order.tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost?.toLocaleString()}`}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-cyan-600">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4" />
                  Shipping Details
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-start gap-3">
                  <FiUser className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-xs text-gray-500 mb-3">Having issues with your order?</p>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Contact Support
                <FiArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail