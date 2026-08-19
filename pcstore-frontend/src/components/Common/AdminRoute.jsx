import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  
  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }
  
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" />
}

export default AdminRoute