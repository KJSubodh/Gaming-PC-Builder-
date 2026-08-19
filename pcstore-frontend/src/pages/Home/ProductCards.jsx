import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Fixed relative asset paths (pointing 3 levels up since it is nested inside src/pages/Home/)
import buildImg from "/src/assets/build-your-own-PC.jpg"
import partsImg from "/src/assets/gaming_PC_parts.jpg"
import accessoriesImg from "/src/assets/gaming_PC_accessories.jpg"
import prebuiltImg from "/src/assets/gaming_PC.jpg"

const productSections = [
  {
    title: "Build Your Dream PC",
    description: "Customize every individual component to configure your ultimate balanced performance rig.",
    image: buildImg,
    path: "/pc-builder"
  },
  {
    title: "Premium PC Parts",
    description: "Browse curated, top-tier standalone hardware pieces directly from trusted manufacturers.",
    image: partsImg,
    path: "/products"
  },
  {
    title: "Pre-Built Systems",
    description: "Turnkey setups professionally built, fine-tuned, and fully ready-to-ship to your desk.",
    image: prebuiltImg,
    path: "/pre-built"
  },
  {
    title: "Gaming Accessories",
    description: "Complete your architectural battlestation with premium ergonomic peripherals.",
    image: accessoriesImg,
    path: "/accessories"
  },
]

const ProductCards = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      
      {/* Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
          Explore Our Ecosystem
        </h2>
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 max-w-md mx-auto">
          Everything required to construct and accelerate your desktop computing architecture
        </p>
      </motion.div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col h-full bg-white border border-gray-200/70 overflow-hidden group hover:border-gray-900 transition-colors duration-300 rounded-2xl"
          >
            <Link to={section.path} className="flex flex-col h-full">
              
              {/* Image Window */}
              <div className="w-full h-48 overflow-hidden bg-gray-100 relative rounded-t-2xl">
                <img 
                  src={section.image} 
                  alt={section.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out grayscale-[20%] group-hover:grayscale-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.classList.add('bg-gray-50', 'flex', 'items-center', 'justify-center');
                  }}
                />
              </div>

              {/* Text Meta Container */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 tracking-tight mb-2 group-hover:text-purple-600 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {section.description}
                  </p>
                </div>

                {/* Subtle Action Link */}
                <div className="pt-6 mt-auto">
                  <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase inline-flex items-center gap-1 group-hover:text-black group-hover:translate-x-1 transition-all duration-200">
                    Discover Section <span className="text-xs">→</span>
                  </span>
                </div>
              </div>

            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProductCards