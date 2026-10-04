import React, { useState, useEffect } from 'react'
import SpecEditor, { rowsToSpecs, specsToRows } from '../../components/SpecEditor'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { productService } from '../../services/productService'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiSave, FiX, FiUpload, FiTrash2, FiStar } from 'react-icons/fi'
import api from '../../services/api'

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'

const AdminProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    category: 'CPU',
    description: '',
    price: '',
    stockQuantity: '',
    socket: '',
    cores: '',
    threads: '',
    ramType: '',
    ramSpeed: '',
    ramCapacity: '',
    vram: '',
    wattage: '',
    efficiency: '',
    formFactor: '',
    screenSize: '',
    refreshRate: '',
    resolution: '',
    coolingType: '',
    fanSize: '',
    rgb: 'false',
    features: {}
  })

  const [images, setImages] = useState([])
  const [specRows, setSpecRows] = useState([])
  const [uploading, setUploading] = useState(false)
  const [existingImages, setExistingImages] = useState([])

  const { data: existingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: isEditing
  })

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || '',
        brand: existingProduct.brand || '',
        model: existingProduct.model || '',
        category: existingProduct.category || 'CPU',
        description: existingProduct.description || '',
        price: existingProduct.price || '',
        stockQuantity: existingProduct.stockQuantity || '',
        socket: existingProduct.socket || '',
        cores: existingProduct.cores || '',
        threads: existingProduct.threads || '',
        ramType: existingProduct.ramType || '',
        ramSpeed: existingProduct.ramSpeed || '',
        ramCapacity: existingProduct.ramCapacity || '',
        vram: existingProduct.vram || '',
        wattage: existingProduct.wattage || '',
        efficiency: existingProduct.efficiency || '',
        formFactor: existingProduct.formFactor || '',
        screenSize: existingProduct.screenSize || '',
        refreshRate: existingProduct.refreshRate || '',
        resolution: existingProduct.resolution || '',
        coolingType: existingProduct.coolingType || '',
        fanSize: existingProduct.fanSize || '',
        rgb: existingProduct.rgb || 'false',
        features: existingProduct.features && !Array.isArray(existingProduct.features) ? existingProduct.features : {}
      })
      setSpecRows(specsToRows(existingProduct.specifications))

      if (existingProduct.images && existingProduct.images.length > 0) {
        setExistingImages(existingProduct.images)
      }
    }
  }, [existingProduct])

  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEditing) {
        return adminService.updateProduct(id, data)
      } else {
        return adminService.createProduct(data)
      }
    },
    onSuccess: (createdProduct) => {
      queryClient.invalidateQueries(['adminProducts'])
      toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully')
      if (!isEditing) {
        navigate(`/admin/products/${createdProduct.id}/edit`)
      } else {
        navigate('/admin/products')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save product')
    }
  })

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    if (!isEditing) {
      toast.error('Please save the product first, then upload images')
      return
    }

    const formData = new FormData()
    files.forEach(file => formData.append('images', file))

    setUploading(true)
    try {
      await api.post(`/admin/products/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success(`${files.length} image(s) uploaded successfully`)
      setImages([])
      queryClient.invalidateQueries(['product', id])
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/admin/products/${id}/images/${imageId}`)
      setImages(prev => prev.filter(img => img.id !== imageId))
      setExistingImages(prev => prev.filter(img => img.id !== imageId))
      toast.success('Image deleted')
    } catch (error) {
      toast.error('Failed to delete image')
    }
  }

  const handleSetPrimary = async (imageId) => {
    try {
      await api.put(`/admin/products/${id}/images/${imageId}/primary`)
      setExistingImages(prev => prev.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      })))
      setImages(prev => prev.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      })))
      toast.success('Primary image updated')
    } catch (error) {
      toast.error('Failed to set primary image')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      fanSize: formData.fanSize ? parseInt(formData.fanSize) : null,
      rgb: formData.rgb === 'true' || formData.rgb === 'argb',
      features: Array.isArray(formData.features) ? {} : formData.features,
      specifications: rowsToSpecs(specRows)
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const allImages = [...existingImages, ...images]

  // Helper to check if current category is a cooling type
  const isCoolingCategory = () => {
    return ['COOLING_CPU_AIR', 'COOLING_CPU_LIQUID', 'COOLING_FAN'].includes(formData.category)
  }

  // Helper to check if current category is a peripheral
  const isPeripheralCategory = () => {
    const peripherals = ['KEYBOARD', 'MOUSE', 'MOUSE_PAD', 'HEADSET', 'CONTROLLER', 'GAMEPAD', 'DRIVING_WHEEL', 'GAMING_CHAIR', 'SPEAKER', 'MICROPHONE', 'WEBCAM']
    return peripherals.includes(formData.category)
  }

  // Helper to check if current category is an accessory
  const isAccessoryCategory = () => {
    const accessories = ['THERMAL_PASTE', 'CABLE_MANAGEMENT', 'MONITOR_ARM', 'USB_HUB', 'CAPTURE_CARD', 'DESK_MAT', 'UPS']
    return accessories.includes(formData.category)
  }

  return (
    <div className="px-8 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/products')}
            className="group relative flex items-center gap-2 px-5 py-2.5 mb-6 text-sm font-semibold text-white transition-all duration-300 bg-slate-900 border border-purple-500/50 rounded-lg hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-[0.98] cursor-pointer overflow-hidden"
          >
            <FiArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1 shrink-0" />
            <span>Back to Products</span>
          </button>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {isEditing ? 'Update product details and images' : 'Fill in the details to add a new product'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-xl p-6">
          {/* Basic Information Section */}
          <div className="mb-6 pb-4 border-b border-neutral-100">
            <h2 className="text-base font-semibold text-neutral-900 mb-1">Basic Information</h2>
            <p className="text-xs text-neutral-500">General product details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="e.g., Noctua NH-D15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="e.g., Noctua, Corsair, NZXT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="e.g., NH-D15, H150i Elite"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors bg-white"
              >
                <optgroup label="Core Components">
                  <option value="CPU">CPU</option>
                  <option value="GPU">GPU</option>
                  <option value="MOTHERBOARD">Motherboard</option>
                  <option value="RAM">RAM</option>
                  <option value="PSU">PSU</option>
                  <option value="CASE">Case</option>
                </optgroup>
                <optgroup label="Cooling">
                  <option value="COOLING_CPU_AIR">CPU Air Cooler</option>
                  <option value="COOLING_CPU_LIQUID">CPU Liquid Cooler (AIO)</option>
                  <option value="COOLING_FAN">Case Fan</option>
                </optgroup>
                <optgroup label="Storage">
                  <option value="STORAGE_NVME">NVMe SSD</option>
                  <option value="STORAGE_SATA">SATA SSD</option>
                  <option value="STORAGE_HDD">HDD</option>
                </optgroup>
                <optgroup label="Peripherals">
                  <option value="KEYBOARD">Keyboard</option>
                  <option value="MOUSE">Mouse</option>
                  <option value="MOUSE_PAD">Mouse Pad</option>
                  <option value="HEADSET">Headset</option>
                  <option value="CONTROLLER">Controller</option>
                  <option value="GAMEPAD">Gamepad</option>
                  <option value="DRIVING_WHEEL">Driving Wheel</option>
                  <option value="GAMING_CHAIR">Gaming Chair</option>
                  <option value="SPEAKER">Speaker</option>
                  <option value="MICROPHONE">Microphone</option>
                  <option value="WEBCAM">Webcam</option>
                </optgroup>
                <optgroup label="Accessories">
                  <option value="THERMAL_PASTE">Thermal Paste</option>
                  <option value="CABLE_MANAGEMENT">Cable Management</option>
                  <option value="MONITOR_ARM">Monitor Arm</option>
                  <option value="USB_HUB">USB Hub</option>
                  <option value="CAPTURE_CARD">Capture Card</option>
                  <option value="DESK_MAT">Desk Mat</option>
                  <option value="UPS">UPS</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Stock Quantity *</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="0"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors resize-none"
              placeholder="Product description..."
            />
          </div>

          {/* Image Upload Section */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <h2 className="text-base font-semibold text-neutral-900 mb-1">Product Images</h2>
            <p className="text-xs text-neutral-500 mb-4">Upload product images (JPEG, PNG, WebP)</p>

            <div className="mb-4">
              <label className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading ? 'bg-gray-100 border-gray-300' : 'border-neutral-300 hover:border-purple-500 hover:bg-purple-50'}`}>
                <div className="flex items-center gap-2">
                  <FiUpload className={uploading ? 'animate-pulse' : ''} />
                  <span className="text-sm">{uploading ? 'Uploading...' : 'Click to upload images'}</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading || !isEditing}
                  className="hidden"
                />
              </label>
              {!isEditing && (
                <p className="text-xs text-amber-600 mt-2">⚠️ Save the product first, then upload images</p>
              )}
            </div>

            {/* Image Gallery */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {allImages.map((img) => (
                  <div key={img.id} className="relative group border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                    <img
                      src={img.url?.startsWith('http') ? img.url : `${BACKEND_URL}${img.url}`}
                      alt="Product"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.id)}
                          className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          title="Set as Primary"
                        >
                          <FiStar size={14} />
                        </button>
                      )}
                    </div>
                    {img.isPrimary && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Primary</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specifications Section */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <h2 className="text-base font-semibold text-neutral-900 mb-1">Specifications</h2>
            <p className="text-xs text-neutral-500 mb-4">Technical specifications based on category</p>

            {/* CPU Specific Fields */}
            {formData.category === 'CPU' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Socket</label>
                  <input type="text" name="socket" value={formData.socket} onChange={handleChange} placeholder="AM5, LGA1700" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Cores</label>
                  <input type="number" name="cores" value={formData.cores} onChange={handleChange} placeholder="8, 12, 16" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Threads</label>
                  <input type="number" name="threads" value={formData.threads} onChange={handleChange} placeholder="16, 24, 32" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
              </div>
            )}

            {/* RAM Specific Fields */}
            {formData.category === 'RAM' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">RAM Type</label>
                  <select name="ramType" value={formData.ramType} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors bg-white">
                    <option value="">Select</option>
                    <option value="DDR4">DDR4</option>
                    <option value="DDR5">DDR5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Speed (MHz)</label>
                  <input type="number" name="ramSpeed" value={formData.ramSpeed} onChange={handleChange} placeholder="3200, 5600, 6000" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Capacity (GB)</label>
                  <input type="number" name="ramCapacity" value={formData.ramCapacity} onChange={handleChange} placeholder="8, 16, 32" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
              </div>
            )}

            {/* GPU Specific Fields */}
            {formData.category === 'GPU' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">VRAM (GB)</label>
                  <input type="number" name="vram" value={formData.vram} onChange={handleChange} placeholder="8, 12, 16" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
              </div>
            )}

            {/* PSU Specific Fields */}
            {formData.category === 'PSU' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Wattage</label>
                  <input type="number" name="wattage" value={formData.wattage} onChange={handleChange} placeholder="650, 750, 850" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Efficiency</label>
                  <select name="efficiency" value={formData.efficiency} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors bg-white">
                    <option value="">Select</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
              </div>
            )}

            {/* Cooling Specific Fields */}
            {isCoolingCategory() && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Fan Size (mm)</label>
                  <input type="number" name="fanSize" value={formData.fanSize} onChange={handleChange} placeholder="120, 140" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">RGB</label>
                  <select name="rgb" value={formData.rgb} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors bg-white">
                    <option value="false">No RGB</option>
                    <option value="true">RGB</option>
                  </select>
                </div>
              </div>
            )}

            {/* Case Specific Fields */}
            {formData.category === 'CASE' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Form Factor</label>
                  <input type="text" name="formFactor" value={formData.formFactor} onChange={handleChange} placeholder="ATX, Micro ATX, Mini ITX" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
              </div>
            )}

            {/* Monitor Specific Fields */}
            {formData.category === 'MONITOR' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Screen Size (inches)</label>
                  <input type="number" name="screenSize" value={formData.screenSize} onChange={handleChange} placeholder="24, 27, 32" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Refresh Rate (Hz)</label>
                  <input type="number" name="refreshRate" value={formData.refreshRate} onChange={handleChange} placeholder="144, 165, 240" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Resolution</label>
                  <input type="text" name="resolution" value={formData.resolution} onChange={handleChange} placeholder="1920x1080, 2560x1440" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-neutral-500 transition-colors" />
                </div>
              </div>
            )}
          </div>

          <SpecEditor category={formData.category} rows={specRows} onChange={setSpecRows} />

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FiX size={14} /> Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <FiSave size={14} /> {mutation.isPending ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminProductForm