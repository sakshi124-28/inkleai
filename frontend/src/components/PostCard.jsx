import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import './PostCard.css'

const PostCard = ({ post, onDelete }) => {
  const { profile } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Set like status and count from post data if available
    if (post?.is_liked !== undefined) {
      setLiked(post.is_liked)
    }
    if (post?.like_count !== undefined) {
      setLikeCount(post.like_count)
    } else {
      // Fallback: fetch post details to get like info
      fetchPostDetails()
    }
  }, [post])

  const fetchPostDetails = async () => {
    if (!post?.id) return
    
    try {
      const postData = await api.getPost(post.id)
      if (postData.is_liked !== undefined) {
        setLiked(postData.is_liked)
      }
      if (postData.like_count !== undefined) {
        setLikeCount(postData.like_count)
      }
    } catch (err) {
      console.error('Error fetching post details:', err)
    }
  }

  const handleLike = async () => {
    if (loading) return
    setLoading(true)

    try {
      if (liked) {
        await api.unlikePost(post.id)
        setLiked(false)
        setLikeCount(prev => Math.max(0, prev - 1))
      } else {
        await api.likePost(post.id)
        setLiked(true)
        setLikeCount(prev => prev + 1)
      }
      // Refresh post data to get accurate count
      fetchPostDetails()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to like post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await api.deletePost(post.id)
      onDelete && onDelete(post.id)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete post')
    }
  }

  const canDelete = profile && (
    post.author_id === profile.id ||
    profile.role === 'admin' ||
    profile.role === 'owner'
  )

  const formatTime = (date) => {
    const now = new Date()
    const postDate = new Date(date)
    const diff = now - postDate
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return `${seconds}s`
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.author?.id || post.author_id}`} className="post-author">
          <img 
            src={post.author?.avatar_url || '/default-avatar.png'} 
            alt={post.author?.display_name || post.author?.username} 
            className="post-avatar"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23e5e7eb"/%3E%3C/svg%3E'
            }}
          />
          <div className="post-author-info">
            <div className="post-author-name">{post.author?.username || 'unknown'}</div>
            <div className="post-time">{formatTime(post.created_at)} ago</div>
          </div>
        </Link>
        {canDelete && (
          <button onClick={handleDelete} className="btn-delete" title="Delete post">
            ⋯
          </button>
        )}
      </div>

      {post.media_url && (
        <img src={post.media_url} alt="Post" className="post-media" />
      )}

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`btn-like ${liked ? 'liked' : ''}`}
          disabled={loading}
          title={liked ? 'Unlike' : 'Like'}
        >
          {liked ? (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>
        <Link to={`/posts/${post.id}`} className="post-view-link">
          View Post
        </Link>
      </div>
    </div>
  )
}

export default PostCard

