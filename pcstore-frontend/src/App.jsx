import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/index'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PCBuilder from './pages/PCBuilder'
import CompatibilityCheck from './pages/CompatibilityCheck'
import Accessories from './pages/Accessories'
import Peripherals from './pages/Peripherals'
import PreBuiltPC from './pages/PreBuiltPC'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import ContactUs from './pages/ContactUs' 
import AboutUs from './pages/AboutUs' // <--- 1. IMPORT THE ABOUT US PAGE HERE
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProductForm from './pages/admin/AdminProductForm'
import PrivateRoute from './components/Common/PrivateRoute'
import AdminRoute from './components/Common/AdminRoute'
import Services from './pages/Services'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:category" element={<Products />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="pc-builder" element={<PCBuilder />} />
        <Route path="compatibility" element={<CompatibilityCheck />} />
        <Route path="accessories" element={<Accessories />} />
        <Route path="peripherals" element={<Peripherals />} />
        <Route path="pre-built" element={<PreBuiltPC />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="services" element={<Services />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
        </Route>
        
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/products/new" element={<AdminProductForm />} />
          <Route path="admin/products/:id/edit" element={<AdminProductForm />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App