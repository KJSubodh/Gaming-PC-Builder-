// src/pages/Home/FeaturesSection.jsx
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FeaturesSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const features = [
    {
      emoji: "🔧",
      title: "Compatibility Guaranteed",
      description: "Our PC Builder ensures every component works together perfectly before you buy."
    },
    {
      emoji: "🚚",
      title: "Pan-India Shipping",
      description: "Free shipping on orders over ₹50,000. Fast delivery across all major cities."
    },
    {
      emoji: "🎧",
      title: "Expert Build Support",
      description: "24/7 technical support from PC building enthusiasts who actually know their stuff."
    },
    {
      emoji: "📦",
      title: "3-Year Warranty",
      description: "All pre-built systems come with 3 years of comprehensive warranty coverage."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section ref={sectionRef} className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            Why Choose Us
          </h2>
          <p className="text-gray-400">Building dreams, one PC at a time</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection