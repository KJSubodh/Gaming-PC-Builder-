import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute