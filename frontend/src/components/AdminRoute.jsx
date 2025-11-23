import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children, requireOwner = false }) => {
  const { isAuthenticated, loading, profile } = useAuth()

  if (loading) {
    return <div className="container">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const userRole = profile?.role || 'user'

  if (requireOwner && userRole !== 'owner') {
    return <Navigate to="/feed" replace />
  }

  if (userRole !== 'admin' && userRole !== 'owner') {
    return <Navigate to="/feed" replace />
  }

  return children
}

export default AdminRoute

