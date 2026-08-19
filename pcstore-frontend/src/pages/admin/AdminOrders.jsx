import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'
import { FiEye, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiSearch } from 'react-icons/fi'

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: () => adminService.getAllOrders()
  })

  const filteredOrders = orders?.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders'])
      toast.success('Order status updated')
      setSelectedOrder(null)
    },
    onError: () => {
      toast.error('Failed to update order status')
    }
  })

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PROCESSING: 'bg-blue-100 text-blue-700',
      SHIPPED: 'bg-purple-100 text-purple-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <FiPackage size={12} className="inline mr-1" />
      case 'PROCESSING': return <FiPackage size={12} className="inline mr-1" />
      case 'SHIPPED': return <FiTruck size={12} className="inline mr-1" />
      case 'DELIVERED': return <FiCheckCircle size={12} className="inline mr-1" />
      case 'CANCELLED': return <FiXCircle size={12} className="inline mr-1" />
      default: return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-neutral-900"></div>
      </div>
    )
  }

  return (
    <div className="px-8 py-16">
      <div className="mx-auto px-32">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Manage Orders</h1>
          <p className="text-neutral-500 text-sm mt-1">View and update customer orders</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 transition-colors"
            />
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-neutral-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-neutral-900">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900">{order.customerName}</div>
                        <div className="text-sm text-neutral-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-neutral-900">₹{order.totalAmount?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)} {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1 text-sm"
                        >
                          <FiEye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-neutral-900">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Order Information</h3>
                <p className="text-sm text-neutral-600">Order #: {selectedOrder.orderNumber}</p>
                <p className="text-sm text-neutral-600">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Customer Details</h3>
                <p className="text-sm text-neutral-600">Name: {selectedOrder.customerName}</p>
                <p className="text-sm text-neutral-600">Email: {selectedOrder.customerEmail}</p>
                <p className="text-sm text-neutral-600">Phone: {selectedOrder.customerPhone}</p>
                <p className="text-sm text-neutral-600">Address: {selectedOrder.shippingAddress}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm border-b border-neutral-100 py-2">
                      <span className="text-neutral-600">{item.productName} x {item.quantity}</span>
                      <span className="font-medium text-neutral-900">₹{item.totalPrice?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-900">Total:</span>
                  <span className="text-lg font-bold text-neutral-900">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Update Status</h3>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => updateStatusMutation.mutate({ id: selectedOrder.id, status: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders