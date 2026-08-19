// src/pages/Home/StatsSection.jsx
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const Counter = ({ target, suffix = "" }) => {
  const [count, setCount] = React.useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  React.useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

const StatsSection = () => {
  const stats = [
    { value: 500, suffix: "+", label: "Components", gradient: "from-purple-500 to-pink-500" },
    { value: 50, suffix: "K+", label: "Happy Builders", gradient: "from-blue-500 to-cyan-500" },
    { value: 24, suffix: "/7", label: "Support", gradient: "from-green-500 to-emerald-500" },
    { value: 3, suffix: " Days", label: "Build Time", gradient: "from-orange-500 to-red-500" },
    { value: 99, suffix: "%", label: "Satisfaction", gradient: "from-yellow-500 to-amber-500" },
  ]

  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section - Centered */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            Our Metrics
          </h2>
          <p className="text-gray-400">Serving our Clients and Customers</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection