import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import AdminNav from '../../components/AdminNav'
import './Admin.css'

const LikeManagement = () => {
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLikes()
  }, [])

  const loadLikes = async () => {
    try {
      setLoading(true)
      const data = await api.getAllLikes(50, 0)
      setLikes(data.likes || [])
    } catch (err) {
      setError('Failed to load likes')
      console.error('Error loading likes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (likeId) => {
    if (!confirm('Are you sure you want to delete this like?')) {
      return
    }

    try {
      await api.deleteLike(likeId)
      alert('Like deleted successfully')
      loadLikes()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete like')
    }
  }

  if (loading) {
    return <div className="admin-container">Loading likes...</div>
  }

  return (
    <div>
      <AdminNav />
      <div className="admin-container">
        <div className="admin-header">
        <h1>Like Management</h1>
        <div className="admin-header-actions">
          <button onClick={loadLikes} className="btn btn-primary">
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Post Content</th>
              <th>Post Author</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {likes.map((like) => (
              <tr key={like.id}>
                <td className="id-cell">{like.id.substring(0, 8)}...</td>
                <td>
                  <Link to={`/profile/${like.user?.id || like.user_id}`}>
                    {like.user?.display_name || like.user?.username || 'Unknown'}
                  </Link>
                </td>
                <td className="content-cell">
                  {like.post?.content 
                    ? (like.post.content.length > 50 
                        ? `${like.post.content.substring(0, 50)}...` 
                        : like.post.content)
                    : 'Post not found'}
                </td>
                <td>
                  {like.post?.author_id ? (
                    <Link to={`/profile/${like.post.author_id}`}>
                      View Author
                    </Link>
                  ) : '-'}
                </td>
                <td>{new Date(like.created_at).toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleDelete(like.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {likes.length === 0 && (
        <div className="empty-state">No likes found</div>
      )}
      </div>
    </div>
  )
}

export default LikeManagement

