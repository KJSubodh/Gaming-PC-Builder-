import React from 'react'
import { motion } from 'framer-motion'

// Import logos - paths kept exactly as they are
import acerLogo from '../../assets/logos/Acer-Logo.png'
import amdLogo from '../../assets/logos/amd-logo.png'
import asusLogo from '../../assets/logos/Asus-logo.png'
import corsairLogo from '../../assets/logos/Corsair-logo.png'
import gigabyteLogo from '../../assets/logos/Gigabyte_Technology-Logo.png'
import intelLogo from '../../assets/logos/intel-logo.png'
import logitechLogo from '../../assets/logos/logitech-logo.png'
import msiLogo from '../../assets/logos/Msi_Logo.png'
import nvidiaLogo from '../../assets/logos/nvidia-logo.png'
import razerLogo from '../../assets/logos/Razer-logo.png'
import viewsonicLogo from '../../assets/logos/ViewSonic_logo.png'
import hyperXLogo from '../../assets/logos/HyperX_Logo.png'

// Split into two distinct rows to create a multi-directional matrix look
const row1 = [
  { name: 'NVIDIA', logo: nvidiaLogo },
  { name: 'AMD', logo: amdLogo },
  { name: 'Intel', logo: intelLogo },
  { name: 'Asus', logo: asusLogo },
  { name: 'MSI', logo: msiLogo },
  { name: 'Gigabyte', logo: gigabyteLogo },
]

const row2 = [
  { name: 'Corsair', logo: corsairLogo },
  { name: 'Razer', logo: razerLogo },
  { name: 'Logitech', logo: logitechLogo },
  { name: 'HyperX', logo: hyperXLogo },
  { name: 'Acer', logo: acerLogo },
  { name: 'ViewSonic', logo: viewsonicLogo },
]

const Partners = () => {
  return (
    <section className="bg-slate-950 py-20 px-6 md:px-12 overflow-hidden border-t border-b border-slate-900/60 relative">
      {/* Background Subtle Tech Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header Section - Matching StatsSection style */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            Trusted by Industry Leaders
          </h2>
          <p className="text-slate-400">We partner with the best brands in the business</p>
        </motion.div>

        {/* Dual Marquee Track System - No Boxes/Cells */}
        <div className="flex flex-col gap-12 w-full relative">
          
          {/* TRACK 1: Moves Left - With larger click/hover area */}
          <div className="relative w-full overflow-hidden flex items-center">
            <div className="marquee-track-left">
              <div className="marquee-group">
                {row1.map((partner, index) => (
                  <motion.div
                    key={`r1-first-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="group flex-shrink-0 flex items-center justify-center cursor-pointer"
                    style={{ padding: '0 2rem' }}
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="h-14 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 filter contrast-125 brightness-90" 
                    />
                  </motion.div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {row1.map((partner, index) => (
                  <motion.div
                    key={`r1-second-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="group flex-shrink-0 flex items-center justify-center cursor-pointer"
                    style={{ padding: '0 2rem' }}
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="h-14 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 filter contrast-125 brightness-90" 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* TRACK 2: Moves Right - With larger click/hover area */}
          <div className="relative w-full overflow-hidden flex items-center">
            <div className="marquee-track-right">
              <div className="marquee-group">
                {row2.map((partner, index) => (
                  <motion.div
                    key={`r2-first-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="group flex-shrink-0 flex items-center justify-center cursor-pointer"
                    style={{ padding: '0 2rem' }}
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="h-14 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 filter contrast-125 brightness-90" 
                    />
                  </motion.div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {row2.map((partner, index) => (
                  <motion.div
                    key={`r2-second-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="group flex-shrink-0 flex items-center justify-center cursor-pointer"
                    style={{ padding: '0 2rem' }}
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="h-14 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 filter contrast-125 brightness-90" 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Partners