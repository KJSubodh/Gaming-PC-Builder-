// src/components/Common/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  
  console.log('AdminRoute Debug:', { isAuthenticated, isAdmin, loading }) // ADD THIS
  
  if (loading) return <div>Loading...</div>
  
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" />
}

export default AdminRoute