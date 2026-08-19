import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '../services/orderService'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiShoppingBag, FiArrowRight, FiAlertCircle, FiCalendar, FiFilter, FiHome } from 'react-icons/fi'

const Orders = () => {
  const [timeFilter, setTimeFilter] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => orderService.getMyOrders()
  })

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <FiClock className="text-amber-400" size={14} />
      case 'PROCESSING': return <FiPackage className="text-blue-400" size={14} />
      case 'SHIPPED': return <FiTruck className="text-cyan-400" size={14} />
      case 'DELIVERED': return <FiCheckCircle className="text-green-400" size={14} />
      case 'CANCELLED': return <FiAlertCircle className="text-red-400" size={14} />
      default: return <FiPackage className="text-gray-400" size={14} />
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
      PENDING: 'Pending',
      PROCESSING: 'Processing',
      SHIPPED: 'Shipped',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled'
    }
    return texts[status] || status
  }

  // Filter orders by time range
  const filterOrdersByTime = (orders, filter) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      switch(filter) {
        case 'today':
          return orderDate >= today
        case 'week':
          return orderDate >= startOfWeek
        case 'month':
          return orderDate >= startOfMonth
        case 'year':
          return orderDate >= startOfYear
        default:
          return true
      }
    })
  }

  // Filter orders by status
  const filterOrdersByStatus = (orders, status) => {
    if (status === 'all') return orders
    return orders.filter(order => order.orderStatus === status)
  }

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    let filtered = filterOrdersByTime(orders, timeFilter)
    filtered = filterOrdersByStatus(filtered, selectedStatus)
    return filtered
  }, [orders, timeFilter, selectedStatus])

  const stats = {
    total: filteredOrders.length,
    delivered: filteredOrders.filter(o => o.orderStatus === 'DELIVERED').length,
    shipped: filteredOrders.filter(o => o.orderStatus === 'SHIPPED').length,
    processing: filteredOrders.filter(o => o.orderStatus === 'PROCESSING' || o.orderStatus === 'PENDING').length,
    totalSpent: filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  }

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ]

  const statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative overflow-hidden bg-slate-950 py-20 mb-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="h-8 w-48 bg-slate-800 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 w-96 bg-slate-800 rounded-lg mx-auto mb-3 animate-pulse"></div>
            <div className="h-6 w-64 bg-slate-800 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-slate-950 text-white py-20 mb-8 border-b border-cyan-500/20">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 tracking-wider uppercase">
              <FiShoppingBag className="w-3 h-3" /> Order History
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-white">
              My Orders
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Track your purchases and view order history
            </p>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <FiHome className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Empty State */}
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
            <FiShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet</p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Start Shopping
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-20 mb-8 border-b border-cyan-500/20">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 tracking-wider uppercase">
            <FiShoppingBag className="w-3 h-3" /> Order History
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-white">
            My Orders
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Track your purchases and view order history
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <FiHome className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Stats Cards - Horizontal Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Orders</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FiShoppingBag className="text-gray-600" size={18} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                <p className="text-xs text-gray-500">Delivered</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-green-600" size={18} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-cyan-600">{stats.shipped}</p>
                <p className="text-xs text-gray-500">In Transit</p>
              </div>
              <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center">
                <FiTruck className="text-cyan-600" size={18} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Spent</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FiPackage className="text-gray-600" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-500" size={16} />
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <div className="flex gap-2">
              {timeFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setTimeFilter(filter.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    timeFilter === filter.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" size={16} />
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedStatus(filter.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedStatus === filter.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table - Compact Design */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FiShoppingBag size={32} className="text-gray-300" />
                        <p>No orders found for this filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm font-mono font-medium text-gray-900">
                          #{order.orderNumber?.slice(-8) || order.id?.slice(-8)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">
                          {order.itemCount || order.items?.length || 0} items
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{order.totalAmount?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(order.orderStatus)}
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(order.orderStatus)}`}>
                            {getStatusText(order.orderStatus)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/orders/${order.orderNumber}`}
                          className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors"
                        >
                          View
                          <FiArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        {filteredOrders.length > 0 && (
          <div className="mt-4 text-right text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders