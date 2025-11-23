import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminNav.css'

const AdminNav = () => {
  const location = useLocation()
  const { profile } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <div className="admin-nav">
      <div className="admin-nav-container">
        <h2 className="admin-nav-title">Admin Panel</h2>
        <nav className="admin-nav-menu">
          <Link 
            to="/admin/dashboard" 
            className={`admin-nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
          >
            📊 Dashboard
          </Link>
          <Link 
            to="/admin/users" 
            className={`admin-nav-link ${isActive('/admin/users') ? 'active' : ''}`}
          >
            👥 Users
          </Link>
          <Link 
            to="/admin/posts" 
            className={`admin-nav-link ${isActive('/admin/posts') ? 'active' : ''}`}
          >
            📝 Posts
          </Link>
          <Link 
            to="/admin/likes" 
            className={`admin-nav-link ${isActive('/admin/likes') ? 'active' : ''}`}
          >
            ❤️ Likes
          </Link>
          {profile?.role === 'owner' && (
            <Link 
              to="/admin/admins" 
              className={`admin-nav-link ${isActive('/admin/admins') ? 'active' : ''}`}
            >
              👑 Admins
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}

export default AdminNav

