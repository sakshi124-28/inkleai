import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import AdminNav from '../../components/AdminNav'
import './Admin.css'

const AdminManagement = () => {
  const [admins, setAdmins] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [promoteUserId, setPromoteUserId] = useState('')
  const [showPromoteForm, setShowPromoteForm] = useState(false)

  useEffect(() => {
    loadAdmins()
    loadUsers()
  }, [])

  const loadAdmins = async () => {
    try {
      setLoading(true)
      const data = await api.getAdmins()
      setAdmins(data.admins || [])
      setError('')
    } catch (err) {
      setError('Failed to load admins')
      console.error('Error loading admins:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const data = await api.getUsers(100, 0)
      // Filter to only show regular users (not admins/owners)
      const regularUsers = (data.users || []).filter(
        user => user.role === 'user' && !user.is_deleted
      )
      setUsers(regularUsers)
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }

  const handlePromote = async () => {
    if (!promoteUserId) {
      alert('Please select a user')
      return
    }

    if (!confirm('Are you sure you want to promote this user to admin?')) {
      return
    }

    try {
      await api.createAdmin(promoteUserId)
      alert('User promoted to admin successfully')
      setPromoteUserId('')
      setShowPromoteForm(false)
      loadAdmins()
      loadUsers()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to promote user')
    }
  }

  const handleRemove = async (adminId, username) => {
    if (!confirm(`Are you sure you want to remove admin privileges from "${username}"?`)) {
      return
    }

    try {
      await api.removeAdmin(adminId)
      alert('Admin removed successfully')
      loadAdmins()
      loadUsers()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove admin')
    }
  }

  if (loading) {
    return <div className="admin-container">Loading admins...</div>
  }

  return (
    <div>
      <AdminNav />
      <div className="admin-container">
        <div className="admin-header">
        <h1>Admin Management</h1>
        <div className="admin-header-actions">
          <button
            onClick={() => setShowPromoteForm(!showPromoteForm)}
            className="btn btn-primary"
          >
            {showPromoteForm ? 'Cancel' : '➕ Promote User to Admin'}
          </button>
          <button onClick={loadAdmins} className="btn btn-secondary">
            🔄 Refresh
          </button>
        </div>
      </div>

      {showPromoteForm && (
        <div className="promote-form">
          <h3>Promote User to Admin</h3>
          <select
            value={promoteUserId}
            onChange={(e) => setPromoteUserId(e.target.value)}
            className="input"
          >
            <option value="">Select a user...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.display_name || user.username})
              </option>
            ))}
          </select>
          <button onClick={handlePromote} className="btn btn-primary">
            Promote to Admin
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Display Name</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.username}</td>
                <td>{admin.display_name || '-'}</td>
                <td>
                  <span className={`role-badge role-${admin.role}`}>
                    {admin.role}
                  </span>
                </td>
                <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/profile/${admin.id}`} className="btn btn-sm btn-primary">
                      View
                    </Link>
                    {admin.role === 'admin' && (
                      <button
                        onClick={() => handleRemove(admin.id, admin.username)}
                        className="btn btn-sm btn-danger"
                      >
                        Remove Admin
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {admins.length === 0 && (
        <div className="empty-state">No admins found</div>
      )}
      </div>
    </div>
  )
}

export default AdminManagement

