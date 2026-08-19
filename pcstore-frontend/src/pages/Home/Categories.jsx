// src/pages/Home/Categories.jsx
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FiCpu, FiZap, FiGrid, FiDatabase, FiHardDrive,
  FiBox, FiWind, FiMonitor
} from 'react-icons/fi'

const Categories = () => {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const categories = [
    { name: "CPU", enum: "CPU", icon: FiCpu, gradient: "from-purple-500 to-pink-500" },
    { name: "GPU", enum: "GPU", icon: FiZap, gradient: "from-rose-500 to-red-500" },
    { name: "Motherboard", enum: "MOTHERBOARD", icon: FiGrid, gradient: "from-emerald-500 to-teal-500" },
    { name: "RAM", enum: "RAM", icon: FiDatabase, gradient: "from-amber-500 to-orange-500" },
    { name: "PSU", enum: "PSU", icon: FiZap, gradient: "from-yellow-500 to-amber-500" },
    { name: "Case", enum: "CASE", icon: FiBox, gradient: "from-indigo-500 to-purple-500" },
    { name: "Air Cooler", enum: "COOLING_CPU_AIR", icon: FiWind, gradient: "from-cyan-500 to-blue-500" },
    { name: "NVMe SSD", enum: "STORAGE_NVME", icon: FiHardDrive, gradient: "from-sky-500 to-blue-500" },
    { name: "SATA SSD", enum: "STORAGE_SATA", icon: FiHardDrive, gradient: "from-teal-500 to-green-500" },
    { name: "HDD", enum: "STORAGE_HDD", icon: FiHardDrive, gradient: "from-gray-500 to-gray-600" },
    { name: "Monitor", enum: "MONITOR", icon: FiMonitor, gradient: "from-green-500 to-emerald-500" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <section ref={sectionRef} className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Shop by <span className="text-gray-900">Category</span>
          </h2>
          <p className="text-gray-500">Browse components and accessories by type</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.button
                key={category.name}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/products?category=${category.enum}`)}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-200 cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.gradient} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600 transition-colors text-center">
                  {category.name}
                </span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Categories