import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import AdminNav from '../../components/AdminNav'
import './Admin.css'

const Dashboard = () => {
  const { profile } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = profile.role === 'owner' 
        ? await api.getOwnerStats()
        : await api.getAdminStats()
      setStats(data)
    } catch (err) {
      setError('Failed to load dashboard stats')
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="admin-container">Loading dashboard...</div>
  }

  if (error) {
    return <div className="admin-container error-message">{error}</div>
  }

  const statsData = stats?.stats || {}
  const recentActivities = stats?.recent_activities || []

  return (
    <div className="page-container">
      <AdminNav />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card stagger-item">
          <h3>Total Users</h3>
          <p className="stat-number">{statsData.total_users || 0}</p>
        </div>
        <div className="stat-card stagger-item">
          <h3>Total Posts</h3>
          <p className="stat-number">{statsData.total_posts || 0}</p>
        </div>
        <div className="stat-card stagger-item">
          <h3>Total Likes</h3>
          <p className="stat-number">{statsData.total_likes || 0}</p>
        </div>
        {profile.role === 'owner' && (
          <div className="stat-card stagger-item">
            <h3>Total Admins</h3>
            <p className="stat-number">{statsData.total_admins || 0}</p>
          </div>
        )}
        <div className="stat-card stagger-item">
          <h3>Total Activities</h3>
          <p className="stat-number">{statsData.total_activities || 0}</p>
        </div>
      </div>

      {recentActivities.length > 0 && (
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-actor">
                  {activity.actor?.display_name || activity.actor?.username || 'Unknown'}
                </div>
                <div className="activity-action">
                  {activity.verb} {activity.object_type}
                </div>
                <div className="activity-time">
                  {new Date(activity.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

        <div className="admin-quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/admin/users" className="quick-action-card">
              <h3>👥 Manage Users</h3>
              <p>View and manage all users</p>
            </Link>
            <Link to="/admin/posts" className="quick-action-card">
              <h3>📝 Manage Posts</h3>
              <p>View and manage all posts</p>
            </Link>
            <Link to="/admin/likes" className="quick-action-card">
              <h3>❤️ Manage Likes</h3>
              <p>View and manage all likes</p>
            </Link>
            {profile.role === 'owner' && (
              <Link to="/admin/admins" className="quick-action-card">
                <h3>👑 Manage Admins</h3>
                <p>Create and remove admins</p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

