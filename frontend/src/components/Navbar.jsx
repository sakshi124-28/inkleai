import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, profile, logout, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [showAdmin, setShowAdmin] = React.useState(false)

  React.useEffect(() => {
    if (profile) {
      const role = profile.role || 'user'
      const isAdmin = role === 'admin' || role === 'owner'
      console.log('🔍 Navbar Debug:', { role, isAdmin, profile })
      setShowAdmin(isAdmin)
      
      // Also check directly from API if role seems wrong
      if (!isAdmin && isAuthenticated) {
        checkRoleDirectly()
      }
    }
  }, [profile, isAuthenticated])

  const checkRoleDirectly = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      
      const response = await fetch('/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        const role = data.role || 'user'
        const isAdmin = role === 'admin' || role === 'owner'
        console.log('🔍 Direct API Check:', { role, isAdmin })
        if (isAdmin) {
          setShowAdmin(true)
          // Refresh profile to update state
          if (refreshProfile) refreshProfile()
        }
      }
    } catch (err) {
      console.error('Error checking role:', err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleRefresh = () => {
    if (refreshProfile) {
      refreshProfile()
    } else {
      window.location.reload()
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/feed" className="navbar-brand">
          Inkle
        </Link>
        {isAuthenticated && profile && (
          <div className="navbar-menu">
            <Link to="/feed" className="navbar-icon" title="Home">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </Link>
            {showAdmin && (
              <Link to="/admin/dashboard" className="navbar-icon" title="Admin">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </Link>
            )}
            <Link to={`/profile/${profile.id}`} className="navbar-icon" title="Profile">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.display_name || profile.username} 
                  className="navbar-avatar"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23e5e7eb"/%3E%3C/svg%3E'
                  }}
                />
              ) : (
                <div className="navbar-avatar navbar-avatar-placeholder">
                  {(profile.display_name || profile.username || 'U')[0].toUpperCase()}
                </div>
              )}
            </Link>
            <button 
              onClick={handleLogout} 
              className="navbar-icon navbar-logout" 
              title="Logout"
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

