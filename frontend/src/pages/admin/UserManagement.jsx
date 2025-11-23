import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import AdminNav from '../../components/AdminNav'
import './Admin.css'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadUsers()
  }, [search])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await api.getUsers(50, 0, search)
      setUsers(data.users || [])
    } catch (err) {
      setError('Failed to load users')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId, username) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return
    }

    try {
      await api.deleteUser(userId)
      alert('User deleted successfully')
      loadUsers()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user')
    }
  }

  if (loading) {
    return <div className="admin-container">Loading users...</div>
  }

  return (
    <div>
      <AdminNav />
      <div className="admin-container">
        <div className="admin-header">
        <h1>User Management</h1>
        <div className="admin-header-actions">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={loadUsers} className="btn btn-primary">
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Display Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Posts</th>
              <th>Likes</th>
              <th>Followers</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.display_name || '-'}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td>
                  {user.is_deleted ? (
                    <span className="status-deleted">Deleted</span>
                  ) : (
                    <span className="status-active">Active</span>
                  )}
                </td>
                <td>{user.stats?.posts || 0}</td>
                <td>{user.stats?.likes || 0}</td>
                <td>{user.stats?.followers || 0}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/profile/${user.id}`} className="btn btn-sm btn-primary">
                      View
                    </Link>
                    {!user.is_deleted && (
                      <button
                        onClick={() => handleDelete(user.id, user.username)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="empty-state">No users found</div>
      )}
      </div>
    </div>
  )
}

export default UserManagement

