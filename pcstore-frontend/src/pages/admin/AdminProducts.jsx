import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi'

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'

const getImageUrl = (images) => {
  const url = images?.[0]?.url  // ← access .url on the image object
  if (!url) return 'https://via.placeholder.com/40'
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`
}

const AdminProducts = () => {
  const [deleteId, setDeleteId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => adminService.getAllProducts()
  })

  console.log('Products data:', products) // ADD THIS
  console.log('Products length:', products?.length) // ADD THIS

  console.log('isLoading:', isLoading)
  console.log('products:', products)
  console.log('products length:', products?.length)

  const filteredProducts = products?.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts'])
      toast.success('Product deleted successfully')
      setDeleteId(null)
    },
    onError: () => {
      toast.error('Failed to delete product')
    }
  })

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Manage Products</h1>
            <p className="text-neutral-500 text-sm mt-1">Add, edit, or remove products from your inventory</p>
          </div>
          <Link to="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
            <FiPlus size={16} /> Add Product
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 transition-colors"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-neutral-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(product.images)}   // ← was: product.images?.[0]
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg bg-neutral-100"
                          />
                          <div>
                            <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                            <div className="text-sm text-neutral-500">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-neutral-600">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-neutral-900">₹{product.price?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${product.stockQuantity < 10 ? 'text-red-600 font-medium' : 'text-neutral-600'}`}>
                          {product.stockQuantity} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-neutral-600 hover:text-neutral-900 mr-4 transition-colors"
                        >
                          <FiEdit className="inline mr-1" size={14} /> Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiTrash2 className="inline mr-1" size={14} /> Delete
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Confirm Delete</h2>
            <p className="text-neutral-500 text-sm mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteMutation.mutate(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts