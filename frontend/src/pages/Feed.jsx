import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import './Feed.css'

const Feed = () => {
  const { profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreatePost, setShowCreatePost] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await api.getPosts(50, 0)
      setPosts(data.posts || [])
    } catch (err) {
      setError('Failed to load posts')
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = () => {
    setShowCreatePost(false)
    loadPosts()
  }

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(p => p.id !== postId))
  }

  return (
    <div className="feed-container">
      <CreatePost onPostCreated={handlePostCreated} />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading feed...</div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={handlePostDelete} />
        ))
      ) : (
        <div className="empty-state">
          <p>No posts yet. Be the first to post!</p>
        </div>
      )}
    </div>
  )
}

export default Feed

