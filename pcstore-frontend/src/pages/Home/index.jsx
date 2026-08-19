// src/pages/Home/index.jsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { productService } from '../../services/productService'
import ProductCard from '../../components/Common/ProductCard'
import HeroSlider from './HeroSlider'
import StatsSection from './StatsSection'
import Categories from './Categories'
import FeaturesSection from './FeaturesSection'
import Testimonials from './Testimonials'
import Partners from './Partners'

const Home = () => {
  const { data: latestProducts, isLoading } = useQuery({
    queryKey: ['latestProducts'],
    queryFn: () => productService.getLatestProducts(8)
  })

  return (
    <div className="overflow-x-hidden">
      <HeroSlider />
      <StatsSection />
      <Categories />
      
      {/* Latest Products Section - Light bg */}
      {/* <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Just Arrived
              </h2>
              <p className="text-gray-500 mt-1">Fresh stock, latest releases</p>
            </div>
            <Link 
              to="/products?sort=newest" 
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section> */}

      <FeaturesSection />
      <Testimonials />
      <Partners />
    </div>
  )
}

export default Home