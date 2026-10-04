import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiArrowLeft, FiShoppingCart, FiCheck } from 'react-icons/fi'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'
const getImageUrl = (img) => {
  const url = img?.url ?? img
  if (!url) return 'https://via.placeholder.com/500'
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`
}

// Presentation only: backend field -> label/unit. Every VALUE comes from the backend.
const FIELDS = [
  ['socket', 'Socket Type'], ['cores', 'Cores'], ['threads', 'Threads'],
  ['baseClock', 'Base Clock', 'GHz'], ['boostClock', 'Max Boost Clock', 'GHz'], ['tdp', 'TDP', 'W'],
  ['ramType', 'Memory Generation'], ['ramSpeed', 'Memory Speed', 'MHz'], ['ramCapacity', 'Capacity', 'GB'], ['casLatency', 'CAS Latency'],
  ['vram', 'VRAM', 'GB'], ['vramType', 'VRAM Type'], ['wattage', 'Wattage', 'W'], ['efficiency', 'Efficiency'], ['modular', 'Modular'],
  ['formFactor', 'Form Factor'], ['caseType', 'Case Type'], ['coolingType', 'Cooling Type'], ['fanSize', 'Fan Size', 'mm'],
  ['storageType', 'Storage Type'], ['storageCapacity', 'Capacity', 'GB'], ['storageInterface', 'Interface'],
  ['readSpeed', 'Read Speed', 'MB/s'], ['writeSpeed', 'Write Speed', 'MB/s'],
  ['screenSize', 'Screen Size', 'in'], ['resolution', 'Resolution'], ['refreshRate', 'Refresh Rate', 'Hz'],
  ['panelType', 'Panel Type'], ['responseTime', 'Response Time', 'ms'],
  ['integratedGraphics', 'Integrated Graphics'], ['rayTracing', 'Ray Tracing'], ['temperedGlass', 'Tempered Glass'],
  ['pwm', 'PWM'], ['rgb', 'RGB Lighting'],
]

const has = (v) => v !== null && v !== undefined && v !== ''
const fmt = (v, unit) => (typeof v === 'boolean' ? (v ? 'Yes' : 'No') : `${v}${unit ? ` ${unit}` : ''}`)

// Admin-entered specs: { groups: [{ title, items: [{label, value}] }] } (also accepts a flat { label: value } map)
const toGroups = (specs) => {
  if (!specs || typeof specs !== 'object') return []
  if (Array.isArray(specs.groups)) return specs.groups.filter((g) => g.items?.length)
  const items = Object.entries(specs)
    .filter(([, v]) => has(v) && typeof v !== 'object')
    .map(([label, value]) => ({ label, value: String(value) }))
  return items.length ? [{ title: 'Details', items }] : []
}

const toFeatures = (f) => {
  if (Array.isArray(f)) return f.map(String)
  if (f && typeof f === 'object') return Object.entries(f).filter(([, v]) => v).map(([k, v]) => (v === true ? k : `${k}: ${v}`))
  return []
}

const ProductDescription = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 border-t-neutral-900" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-neutral-600">Product not found</p>
        <Link to="/products" className="text-purple-600 hover:text-purple-700">Back to Products</Link>
      </div>
    )
  }

  const facts = FIELDS.filter(([k]) => has(product[k])).map(([k, label, unit]) => ({ label, value: fmt(product[k], unit) }))
  const sections = [...(facts.length ? [{ title: 'Key Specifications', items: facts }] : []), ...toGroups(product.specifications)]
  const highlights = [...facts, ...toGroups(product.specifications).flatMap((g) => g.items)].slice(0, 4)
  const features = toFeatures(product.features)
  const image = product.images?.find((i) => i.isPrimary) || product.images?.[0]
  const inStock = product.stockQuantity > 0

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-[280px_1fr] gap-8 items-center">
          <div className="bg-white rounded-2xl p-4 flex items-center justify-center h-64">
            <img src={getImageUrl(image)} alt={product.name} className="max-h-full object-contain" />
          </div>
          <div>
            <Link to={`/product/${product.id}`} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3">
              <FiArrowLeft /> Back to product
            </Link>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">{product.brand}{product.model ? ` · ${product.model}` : ''}</p>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-1">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <span className="text-3xl font-bold">₹{product.price?.toLocaleString('en-IN')}</span>
              <span className={`text-sm font-medium ${inStock ? 'text-green-400' : 'text-red-400'}`}>
                {inStock ? <><FiCheck className="inline" /> In stock</> : 'Out of stock'}
              </span>
            </div>
            <button
              onClick={() => addToCart(product.id, 1)}
              disabled={!inStock}
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {highlights.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {highlights.map((h) => (
              <div key={h.label} className="rounded-xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-500">{h.label}</p>
                <p className="text-lg font-bold text-neutral-900 mt-1">{h.value}</p>
              </div>
            ))}
          </div>
        )}

        {product.description && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Overview</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </section>
        )}

        {features.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Highlights</h2>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <span key={f} className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm border border-purple-100">{f}</span>
              ))}
            </div>
          </section>
        )}

        {sections.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((s) => (
              <section key={s.title} className="rounded-xl border border-neutral-200 overflow-hidden">
                <h3 className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-sm font-semibold text-neutral-900">{s.title}</h3>
                <dl>
                  {s.items.map((item, i) => (
                    <div key={`${item.label}-${i}`} className="flex justify-between gap-4 px-5 py-2.5 border-b border-neutral-100 last:border-0 text-sm">
                      <dt className="text-neutral-500">{item.label}</dt>
                      <dd className="font-medium text-neutral-900 text-right">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm">No detailed specifications have been added for this product yet.</p>
        )}
      </div>
    </div>
  )
}

export default ProductDescription