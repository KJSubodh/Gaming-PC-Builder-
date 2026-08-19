import React, { useState } from 'react'
import { compatibilityService } from '../services/compatibilityService'
import { productService } from '../services/productService'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiTrash2, FiPlus } from 'react-icons/fi'

const CompatibilityCheck = () => {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [result, setResult] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => productService.getAllProducts()
  })

  const filteredProducts = allProducts?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  const addProduct = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      toast.error('Product already added')
      return
    }
    setSelectedProducts([...selectedProducts, product])
    toast.success(`${product.name} added for checking`)
  }

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
    setResult(null) // Clear results when removing products
    toast.success('Product removed')
  }

  const checkCompatibility = async () => {
    if (selectedProducts.length < 2) {
      toast.error('Please select at least 2 components to check')
      return
    }

    try {
      const productIds = selectedProducts.map(p => p.id)
      const compatibilityResult = await compatibilityService.checkCompatibility(productIds)
      setResult(compatibilityResult)
      
      if (compatibilityResult.compatible) {
        toast.success('Components are compatible!')
      } else {
        toast.error('Compatibility issues found!')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check compatibility')
      console.error(error)
    }
  }

  const clearAll = () => {
    setSelectedProducts([])
    setResult(null)
    toast.success('Cleared all components')
  }

  const getCategoryBadgeColor = (category) => {
    const colors = {
      CPU: 'bg-purple-100 text-purple-800',
      GPU: 'bg-green-100 text-green-800',
      MOTHERBOARD: 'bg-blue-100 text-blue-800',
      RAM: 'bg-yellow-100 text-yellow-800',
      PSU: 'bg-red-100 text-red-800',
      CASE: 'bg-gray-100 text-gray-800',
      STORAGE_NVME: 'bg-indigo-100 text-indigo-800',
      STORAGE_SATA: 'bg-indigo-100 text-indigo-800',
      MONITOR: 'bg-pink-100 text-pink-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (productsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading components...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Compatibility Checker</h1>
      <p className="text-gray-600 mb-8">Check if your selected PC components work together</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Selected Components */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Selected Components</h2>
              <span className="text-sm text-gray-500">{selectedProducts.length} items</span>
            </div>
            
            {selectedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500">No components selected yet</p>
                <p className="text-sm text-gray-400 mt-2">Add components from the right panel to check compatibility</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(product.category)}`}>
                          {product.category}
                        </span>
                        <span className="text-xs text-gray-500">{product.brand}</span>
                      </div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-sm text-primary-600 font-semibold mt-1">
                        ₹{product.price?.toLocaleString()}
                      </p>
                      {product.socket && (
                        <p className="text-xs text-gray-400 mt-1">Socket: {product.socket}</p>
                      )}
                      {product.ramType && (
                        <p className="text-xs text-gray-400 mt-1">RAM Type: {product.ramType}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                      title="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {selectedProducts.length > 0 && (
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={checkCompatibility}
                  className="flex-1 btn-primary"
                >
                  Check Compatibility
                </button>
                <button onClick={clearAll} className="btn-secondary">
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Results Display */}
          {result && (
            <div className={`rounded-lg p-6 ${
              result.compatible 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                {result.compatible ? (
                  <FiCheckCircle className="text-green-600 mr-2" size={24} />
                ) : (
                  <FiAlertCircle className="text-red-600 mr-2" size={24} />
                )}
                Compatibility Results
              </h3>
              
              {result.issues && result.issues.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium text-red-600 mb-2">Issues Found:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.issues.map((issue, i) => (
                      <li key={i} className="text-red-600 text-sm">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.warnings && result.warnings.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium text-yellow-600 mb-2 flex items-center">
                    <FiInfo className="mr-1" /> Warnings:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.warnings.map((warning, i) => (
                      <li key={i} className="text-yellow-600 text-sm">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.compatible && (!result.warnings || result.warnings.length === 0) && (
                <div className="mt-3 p-3 bg-green-100 rounded-lg">
                  <p className="text-green-700 font-medium">✓ All components are fully compatible!</p>
                  <p className="text-green-600 text-sm mt-1">You can proceed with your build.</p>
                </div>
              )}
              
              {result.compatible && result.warnings && result.warnings.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                  <p className="text-yellow-700 font-medium">⚠ Compatible with considerations</p>
                  <p className="text-yellow-600 text-sm mt-1">Your build will work, but please review the warnings above.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side - Product Browser */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Browse Components</h2>
            
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field mb-4"
            />
            
            <div className="max-h-[600px] overflow-y-auto space-y-2">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-primary-600 text-sm mt-2"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                filteredProducts.map(product => {
                  const isSelected = selectedProducts.find(p => p.id === product.id)
                  return (
                    <button
                      key={product.id}
                      onClick={() => !isSelected && addProduct(product)}
                      disabled={isSelected}
                      className={`w-full text-left p-3 border rounded-lg transition ${
                        isSelected 
                          ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed' 
                          : 'hover:bg-gray-50 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(product.category)}`}>
                              {product.category}
                            </span>
                            <span className="text-xs text-gray-500">{product.brand}</span>
                            {product.stockQuantity > 0 ? (
                              <span className="text-xs text-green-600">In Stock</span>
                            ) : (
                              <span className="text-xs text-red-600">Out of Stock</span>
                            )}
                          </div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <div className="flex gap-3 mt-1 text-xs text-gray-400">
                            {product.socket && <span>Socket: {product.socket}</span>}
                            {product.ramType && <span>Type: {product.ramType}</span>}
                            {product.cores && <span>{product.cores} Cores</span>}
                            {product.wattage && <span>{product.wattage}W</span>}
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <p className="font-semibold text-primary-600">
                            ₹{product.price?.toLocaleString()}
                          </p>
                          {!isSelected && (
                            <span className="text-xs text-primary-500 mt-1 inline-flex items-center">
                              <FiPlus className="mr-1" /> Add
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-xs text-gray-400 mt-1">Added</span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompatibilityCheck