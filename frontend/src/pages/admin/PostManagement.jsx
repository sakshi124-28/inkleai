import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import AdminNav from '../../components/AdminNav'
import './Admin.css'

const PostManagement = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [likers, setLikers] = useState([])
  const [loadingLikers, setLoadingLikers] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [search])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await api.getAllPosts(50, 0, search)
      setPosts(data.posts || [])
    } catch (err) {
      setError('Failed to load posts')
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await api.deletePost(postId)
      alert('Post deleted successfully')
      loadPosts()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete post')
    }
  }

  const handleViewLikers = async (post) => {
    setSelectedPost(post.id)
    setLoadingLikers(true)
    try {
      const data = await api.getPostLikers(post.id)
      setLikers(data.likers || [])
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to load likers')
      setLikers([])
    } finally {
      setLoadingLikers(false)
    }
  }

  const closeLikersModal = () => {
    setSelectedPost(null)
    setLikers([])
  }

  if (loading) {
    return <div className="admin-container">Loading posts...</div>
  }

  return (
    <div>
      <AdminNav />
      <div className="admin-container">
        <div className="admin-header">
        <h1>Post Management</h1>
        <div className="admin-header-actions">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={loadPosts} className="btn btn-primary">
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
              <th>Author</th>
              <th>Content</th>
              <th>Likes</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="id-cell">{post.id.substring(0, 8)}...</td>
                <td>
                  <Link to={`/profile/${post.author?.id || post.author_id}`}>
                    {post.author?.display_name || post.author?.username || 'Unknown'}
                  </Link>
                </td>
                <td className="content-cell">
                  {post.content.length > 50 
                    ? `${post.content.substring(0, 50)}...` 
                    : post.content}
                </td>
                <td>
                  <div className="like-count-cell">
                    <span>{post.like_count || 0}</span>
                    {post.like_count > 0 && (
                      <button
                        onClick={() => handleViewLikers(post)}
                        className="btn-view-likers"
                        title="View who liked this post"
                      >
                        👥 View
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  {post.is_deleted ? (
                    <span className="status-deleted">Deleted</span>
                  ) : (
                    <span className="status-active">Active</span>
                  )}
                </td>
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/posts/${post.id}`} className="btn btn-sm btn-primary">
                      View
                    </Link>
                    {!post.is_deleted && (
                      <button
                        onClick={() => handleDelete(post.id)}
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

      {posts.length === 0 && (
        <div className="empty-state">No posts found</div>
      )}

      {/* Likers Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={closeLikersModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Users Who Liked This Post</h2>
              <button onClick={closeLikersModal} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              {loadingLikers ? (
                <div className="loading">Loading likers...</div>
              ) : likers.length > 0 ? (
                <div className="likers-list">
                  {likers.map((like) => (
                    <div key={like.id} className="liker-item">
                      <Link to={`/profile/${like.user.id}`} className="liker-info">
                        {like.user.avatar_url && (
                          <img src={like.user.avatar_url} alt={like.user.display_name} className="liker-avatar" />
                        )}
                        <div>
                          <div className="liker-name">{like.user.display_name || like.user.username}</div>
                          <div className="liker-username">@{like.user.username}</div>
                        </div>
                      </Link>
                      <div className="liker-time">
                        {new Date(like.liked_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">No one has liked this post yet</div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default PostManagement

