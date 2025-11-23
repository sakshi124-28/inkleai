import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import PostCard from '../components/PostCard'
import './PostDetail.css'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPost()
  }, [id])

  const loadPost = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.getPost(id)
      setPost(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Post not found')
      console.error('Error loading post:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    navigate('/feed')
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading post...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container">
        <div className="error-message">{error || 'Post not found'}</div>
        <Link to="/feed" className="btn btn-primary">
          Back to Feed
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="post-detail-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Back
        </button>
        <h1>Post Details</h1>
      </div>
      <PostCard post={post} onDelete={handleDelete} />
    </div>
  )
}

export default PostDetail

