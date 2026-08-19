import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiPlusCircle, FiList, FiUserCheck } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getStats()
  })

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: FiPackage, color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: FiShoppingBag, color: 'bg-green-500' },
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'bg-purple-500' },
    { title: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, color: 'bg-yellow-500' },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-neutral-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage your store inventory, orders, and customers</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(stat => (
          <div key={stat.title} className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2.5 rounded-xl text-white`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link 
              to="/admin/products" 
              className="flex items-center justify-between w-full px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2 text-neutral-700">
                <FiList size={16} /> Manage Products
              </span>
              <span className="text-neutral-400 text-sm">→</span>
            </Link>
            <Link 
              to="/admin/products/new" 
              className="flex items-center justify-between w-full px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2 text-neutral-700">
                <FiPlusCircle size={16} /> Add New Product
              </span>
              <span className="text-neutral-400 text-sm">→</span>
            </Link>
            <Link 
              to="/admin/orders" 
              className="flex items-center justify-between w-full px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2 text-neutral-700">
                <FiShoppingBag size={16} /> View Orders
              </span>
              <span className="text-neutral-400 text-sm">→</span>
            </Link>
            <Link 
              to="/admin/users" 
              className="flex items-center justify-between w-full px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2 text-neutral-700">
                <FiUserCheck size={16} /> Manage Users
              </span>
              <span className="text-neutral-400 text-sm">→</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-neutral-900 mb-4">Recent Orders</h2>
          <div className="text-center py-8">
            <p className="text-neutral-400 text-sm">No recent orders to display</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard