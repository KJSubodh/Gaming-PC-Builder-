import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiChevronDown,
  FiCpu, FiGrid, FiHome, FiHeadphones, FiPackage, FiSearch,
  FiShield, FiInfo, FiPhoneCall, FiSettings, FiMonitor,
  FiMousePointer, FiHardDrive, FiBox, FiDatabase,
  FiZap, FiWind, FiTool, FiCamera, FiSpeaker
} from 'react-icons/fi'
import SearchBar from '../Common/SearchBar'

// Placeholder image component
const PlaceholderIcon = ({ category }) => {
  const getColor = () => {
    const colors = {
      processor: 'from-purple-500 to-pink-500',
      motherboard: 'from-blue-500 to-cyan-500',
      cooler: 'from-cyan-500 to-blue-500',
      ram: 'from-amber-500 to-orange-500',
      gpu: 'from-rose-500 to-red-500',
      ssd: 'from-indigo-500 to-purple-500',
      hdd: 'from-gray-500 to-gray-600',
      psu: 'from-yellow-500 to-amber-500',
      cabinet: 'from-slate-500 to-gray-600',
      fan: 'from-sky-500 to-blue-500',
      speaker: 'from-purple-500 to-pink-500',
      webcam: 'from-emerald-500 to-teal-500',
      monitor: 'from-green-500 to-emerald-500',
      keyboard: 'from-violet-500 to-purple-500',
      mouse: 'from-red-500 to-orange-500',
      mousepad: 'from-gray-500 to-slate-500',
      headset: 'from-cyan-500 to-teal-500',
      controller: 'from-rose-500 to-pink-500',
      cables: 'from-blue-500 to-indigo-500',
      ups: 'from-amber-500 to-yellow-500',
      external_ssd: 'from-indigo-500 to-purple-500',
      power_strip: 'from-orange-500 to-red-500',
      usb: 'from-cyan-500 to-blue-500',
    }
    return colors[category] || 'from-purple-500 to-pink-500'
  }

  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getColor()} flex items-center justify-center shadow-lg flex-shrink-0`}>
      <span className="text-white font-bold text-[10px] text-center px-1 leading-tight">
        {category === 'processor' && 'CPU'}
        {category === 'motherboard' && 'MOBO'}
        {category === 'cooler' && 'COOL'}
        {category === 'ram' && 'RAM'}
        {category === 'gpu' && 'GPU'}
        {category === 'ssd' && 'SSD'}
        {category === 'hdd' && 'HDD'}
        {category === 'psu' && 'PSU'}
        {category === 'cabinet' && 'CASE'}
        {category === 'fan' && 'FAN'}
        {category === 'speaker' && 'SPK'}
        {category === 'webcam' && 'CAM'}
        {category === 'monitor' && 'MON'}
        {category === 'keyboard' && 'KB'}
        {category === 'mouse' && 'MSE'}
        {category === 'mousepad' && 'PAD'}
        {category === 'headset' && 'HDS'}
        {category === 'controller' && 'CTRL'}
        {category === 'cables' && 'CBL'}
        {category === 'ups' && 'UPS'}
        {category === 'external_ssd' && 'XSSD'}
        {category === 'power_strip' && 'STRP'}
        {category === 'usb' && 'USB'}
      </span>
    </div>
  )
}

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { getItemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeSubMenu, setActiveSubMenu] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)
  
  const dropdownRef = useRef(null)
  const dropdownButtonRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const itemCount = getItemCount ? getItemCount() : 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setOpenDropdown(false)
    setActiveSubMenu(null)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          dropdownButtonRef.current &&
          !dropdownButtonRef.current.contains(event.target)) {
        setOpenDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setOpenDropdown(false)
        setActiveSubMenu(null)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // Handle hover with delay for better UX
  const handleSubMenuEnter = (menu) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setActiveSubMenu(menu)
  }

  const handleSubMenuLeave = () => {
    const timeout = setTimeout(() => {
      setActiveSubMenu(null)
    }, 150)
    setHoverTimeout(timeout)
  }

  // Handle click for mobile/touch devices
  const handleSubMenuClick = (menu) => {
    if (activeSubMenu === menu) {
      setActiveSubMenu(null)
    } else {
      setActiveSubMenu(menu)
    }
  }

  // Primary nav links (Row 1)
  const primaryLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Custom PC', path: '/pc-builder', icon: FiCpu },
    { name: 'Pre-Built PC', path: '/pre-built', icon: FiPackage },
  ]

  // Top-right utility links
  const topLinks = [
    { name: 'Services', path: '/services', icon: FiSettings },
    { name: 'About Us', path: '/about', icon: FiInfo },
    { name: 'Contact Us', path: '/contact', icon: FiPhoneCall },
  ]

  const subMenus = {
    components: {
      name: 'PC Components',
      icon: FiGrid,
      path: '/products?category=all',
      items: [
        { name: 'Processor', path: '/products?category=CPU', placeholder: 'processor' },
        { name: 'Motherboard', path: '/products?category=MOTHERBOARD', placeholder: 'motherboard' },
        { name: 'CPU Cooler', path: '/products?category=COOLING', placeholder: 'cooler' },
        { name: 'RAM', path: '/products?category=RAM', placeholder: 'ram' },
        { name: 'Graphics Card', path: '/products?category=GPU', placeholder: 'gpu' },
        { name: 'Internal SSD', path: '/products?category=STORAGE_NVME', placeholder: 'ssd' },
        { name: 'Hard Drive', path: '/products?category=STORAGE_HDD', placeholder: 'hdd' },
        { name: 'Power Supply', path: '/products?category=PSU', placeholder: 'psu' },
        { name: 'Cabinets', path: '/products?category=CASE', placeholder: 'cabinet' },
        { name: 'Case Fans', path: '/products?category=COOLING_FAN', placeholder: 'fan' },
      ]
    },
    peripherals: {
      name: 'Peripherals',
      icon: FiHeadphones,
      path: '/peripherals',
      items: [
        { name: 'Speakers', path: '/peripherals?category=SPEAKER', placeholder: 'speaker' },
        { name: 'Webcam', path: '/peripherals?category=WEBCAM', placeholder: 'webcam' },
        { name: 'Monitors', path: '/peripherals?category=MONITOR', placeholder: 'monitor' },
        { name: 'Keyboards', path: '/peripherals?category=KEYBOARD', placeholder: 'keyboard' },
        { name: 'Mice', path: '/peripherals?category=MOUSE', placeholder: 'mouse' },
        { name: 'Mouse Pads', path: '/peripherals?category=MOUSE_PAD', placeholder: 'mousepad' },
        { name: 'Headsets', path: '/peripherals?category=HEADSET', placeholder: 'headset' },
        { name: 'Controllers', path: '/peripherals?category=CONTROLLER', placeholder: 'controller' },
        { name: 'Gamepads', path: '/peripherals?category=GAMEPAD', placeholder: 'controller' },
        { name: 'Driving Wheels', path: '/peripherals?category=DRIVING_WHEEL', placeholder: 'controller' },
        { name: 'Gaming Chairs', path: '/peripherals?category=GAMING_CHAIR', placeholder: 'controller' },
        { name: 'Microphones', path: '/peripherals?category=MICROPHONE', placeholder: 'webcam' },
      ]
    },
    accessories: {
      name: 'Accessories',
      icon: FiBox,
      path: '/accessories',
      items: [
        { name: 'Thermal Paste', path: '/accessories?category=THERMAL_PASTE', placeholder: 'cables' },
        { name: 'Cable Management', path: '/accessories?category=CABLE_MANAGEMENT', placeholder: 'cables' },
        { name: 'Monitor Arms', path: '/accessories?category=MONITOR_ARM', placeholder: 'cables' },
        { name: 'USB Hubs', path: '/accessories?category=USB_HUB', placeholder: 'usb' },
        { name: 'Capture Cards', path: '/accessories?category=CAPTURE_CARD', placeholder: 'cables' },
        { name: 'Desk Mats', path: '/accessories?category=DESK_MAT', placeholder: 'mousepad' },
        { name: 'UPS', path: '/accessories?category=UPS', placeholder: 'ups' },
      ]
    }
  }

  // Menu Item Component with Click + Hover
  const MenuItem = ({ menuKey, menu }) => {
    const Icon = menu.icon
    const isActive = activeSubMenu === menuKey
    const IconComponent = menu.icon

    return (
      <div
        className="relative flex items-center justify-center"
        onMouseEnter={() => handleSubMenuEnter(menuKey)}
        onMouseLeave={handleSubMenuLeave}
      >
        <button
          onClick={() => {
            // Navigate to the main category page
            navigate(menu.path)
            setActiveSubMenu(null)
          }}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer group ${
            isActive || location.pathname === menu.path
              ? 'text-slate-100'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <IconComponent className="w-3.5 h-3.5" />
          <span>{menu.name}</span>
          <FiChevronDown 
            className={`w-3 h-3 transition-transform duration-200 ${
              isActive ? 'rotate-180' : ''
            }`} 
          />
        </button>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-slate-950 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-3 z-50 border border-slate-800"
              style={{
                width: menuKey === 'components' ? '720px' : 
                       menuKey === 'peripherals' ? '580px' : '380px'
              }}
            >
              <div className={`grid gap-2 ${
                menuKey === 'components' ? 'grid-cols-5' : 
                menuKey === 'peripherals' ? 'grid-cols-4' : 'grid-cols-3'
              }`}>
                {menu.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => { 
                      navigate(item.path); 
                      setActiveSubMenu(null);
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors rounded-lg cursor-pointer"
                  >
                    <PlaceholderIcon category={item.placeholder} />
                    <span className="text-[10px] text-center font-medium leading-tight">{item.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-slate-950 ${
        isScrolled ? 'border-b border-slate-800' : 'border-b border-slate-900'
      } shadow-[0_4px_30px_rgba(0,0,0,0.6)]`}>
        
        {/* Row 0 - Top Utility Strip */}
        <div className="hidden lg:block border-b border-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center h-8 px-1">
              <div className="flex items-center gap-3">
                {topLinks.map((link, idx) => (
                  <React.Fragment key={link.name}>
                    <button
                      onClick={() => navigate(link.path)}
                      className={`cursor-pointer text-[11px] font-medium tracking-wide transition-colors ${
                        location.pathname === link.path
                          ? 'text-slate-300'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {link.name}
                    </button>
                    {idx < topLinks.length - 1 && (
                      <span className="text-[11px] text-slate-800 select-none">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 1 - Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 lg:h-16">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold tracking-tight text-white">
                PC<span className="text-slate-500">Store</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-1">
                {primaryLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = location.pathname === link.path

                  return (
                    <button
                      key={link.name}
                      onClick={() => navigate(link.path)}
                      className={`cursor-pointer relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                        isActive
                          ? 'bg-slate-800 text-white border border-slate-700/50'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{link.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
              <button
                onClick={() => { setSearchOpen(true); setIsMenuOpen(false) }}
                aria-label="Search"
                className="cursor-pointer p-2 rounded-xl transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
              >
                <FiSearch className="w-[18px] h-[18px]" />
              </button>

              <Link to="/cart" className="relative">
                <div className="p-2 rounded-xl transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-800/80">
                  <FiShoppingCart className="text-xl" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-slate-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {itemCount}
                    </span>
                  )}
                </div>
              </Link>

              <div className="hidden sm:block w-px h-6 mx-0.5 bg-slate-800" />

              {isAuthenticated ? (
                <div className="relative ml-0 sm:ml-1">
                  <button
                    ref={dropdownButtonRef}
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm shadow-sm">
                      {user?.name?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <FiChevronDown className={`text-xs transition-transform hidden sm:block ${openDropdown ? 'rotate-180' : ''} text-slate-500`} />
                  </button>

                  <AnimatePresence>
                    {openDropdown && (
                      <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-slate-950 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] py-2 z-50 border border-slate-800"
                      >
                        <div className="px-4 py-3 border-b border-slate-800">
                          <p className="text-sm font-semibold text-white">{user?.name || user?.firstName}</p>
                          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>
                        <button onClick={() => { navigate('/profile'); setOpenDropdown(false); }} className="cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition w-full text-left"><FiUser className="w-4 h-4 text-slate-400" /> My Profile</button>
                        <button onClick={() => { navigate('/orders'); setOpenDropdown(false); }} className="cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition w-full text-left"><FiPackage className="w-4 h-4 text-slate-400" /> My Orders</button>
                        {isAdmin && (<button onClick={() => { navigate('/admin'); setOpenDropdown(false); }} className="cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition w-full text-left"><FiShield className="w-4 h-4 text-slate-400" /> Admin Controls</button>)}
                        <hr className="my-2 border-slate-800" />
                        <button onClick={() => { logout(); setOpenDropdown(false); }} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"><FiLogOut className="w-4 h-4" /> Logout</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2 ml-0 sm:ml-1">
                  <button onClick={() => navigate('/login')} className="cursor-pointer px-3 py-2 rounded-xl text-sm font-medium transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-800/80">Login</button>
                  <button onClick={() => navigate('/register')} className="cursor-pointer px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium shadow-lg transition-all">Sign Up</button>
                </div>
              )}

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-xl transition-all ml-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80">
                {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2 - Sub Navigation with Click + Hover */}
        <div className="hidden lg:block border-t border-slate-800/50 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-8 h-10">
              <button
                onClick={() => navigate('/products')}
                className={`text-xs font-medium transition-colors cursor-pointer ${
                  location.pathname === '/products'
                    ? 'text-slate-100'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                All Category
              </button>
              
              <div className="h-4 w-px bg-slate-800" />

              {/* PC Components - Clickable + Hover */}
              <MenuItem menuKey="components" menu={subMenus.components} />

              {/* Peripherals - Clickable + Hover */}
              <MenuItem menuKey="peripherals" menu={subMenus.peripherals} />

              {/* Accessories - Clickable + Hover */}
              <MenuItem menuKey="accessories" menu={subMenus.accessories} />
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-0" />

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setSearchOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[59]" />
            <motion.div initial={{ y: '-100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 40 }} className="fixed top-0 left-0 right-0 z-[60] bg-slate-950 border-b border-slate-800 shadow-2xl">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">Search</span>
                  <button onClick={() => setSearchOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"><FiX size={18} /></button>
                </div>
                <SearchBar onClose={() => setSearchOpen(false)} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs text-slate-500 mr-1 self-center">Quick:</span>
                  {[
                    { label: 'PC Builder', path: '/pc-builder' },
                    { label: 'All Products', path: '/products' },
                    { label: 'Pre-Built', path: '/pre-built' },
                  ].map((q) => (
                    <button key={q.label} onClick={() => { navigate(q.path); setSearchOpen(false) }} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition">{q.label}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 w-80 bg-slate-950 shadow-2xl z-50 lg:hidden flex flex-col border-l border-slate-800">
              <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xl font-bold text-white">PC<span className="text-slate-500">Store</span></span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl hover:bg-slate-800 transition"><FiX size={22} className="text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                {primaryLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = location.pathname === link.path
                  return (
                    <button key={link.name} onClick={() => { navigate(link.path); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-slate-800 text-white border border-slate-700/50' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}>
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </button>
                  )
                })}
                
                <div className="pt-4 mt-2 border-t border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 mb-2">PC Components</p>
                  <div className="grid grid-cols-2 gap-1">
                    {subMenus.components.items.map((item) => (
                      <button key={item.name} onClick={() => { navigate(item.path); setIsMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition">
                        <PlaceholderIcon category={item.placeholder} />
                        <span className="text-xs">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 mb-2">Peripherals</p>
                  <div className="grid grid-cols-2 gap-1">
                    {subMenus.peripherals.items.map((item) => (
                      <button key={item.name} onClick={() => { navigate(item.path); setIsMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition">
                        <PlaceholderIcon category={item.placeholder} />
                        <span className="text-xs">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 mb-2">Accessories</p>
                  <div className="grid grid-cols-2 gap-1">
                    {subMenus.accessories.items.map((item) => (
                      <button key={item.name} onClick={() => { navigate(item.path); setIsMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition">
                        <PlaceholderIcon category={item.placeholder} />
                        <span className="text-xs">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 mb-2">More</p>
                  {topLinks.map((link) => (
                    <button key={link.name} onClick={() => { navigate(link.path); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${location.pathname === link.path ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}>
                      <link.icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {!isAuthenticated && (
                <div className="border-t border-slate-800 p-4 space-y-2">
                  <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="block w-full text-center px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition">Login</button>
                  <button onClick={() => { navigate('/register'); setIsMenuOpen(false); }} className="block w-full text-center px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium shadow-lg transition">Sign Up</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar