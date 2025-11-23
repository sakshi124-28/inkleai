import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import './CreatePost.css'

const CreatePost = ({ onPostCreated, onCancel }) => {
  const { profile } = useAuth()
  const [content, setContent] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const maxLength = 5000

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.createPost({
        content: content.trim(),
        media_url: mediaUrl || null
      })
      setContent('')
      setMediaUrl('')
      onPostCreated()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post">
      <h2>Create Post</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <textarea
          className="textarea"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              setContent(e.target.value)
            }
          }}
          required
          maxLength={maxLength}
        />
        
        <div className={`char-counter ${content.length > maxLength * 0.9 ? 'warning' : ''} ${content.length >= maxLength ? 'error' : ''}`}>
          {content.length} / {maxLength}
        </div>
        
        <input
          type="url"
          className="input"
          placeholder="Image URL (optional)"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
        />
        
        {mediaUrl && (
          <div className="media-preview">
            <img 
              src={mediaUrl} 
              alt="Preview" 
              onError={(e) => {
                e.target.style.display = 'none'
              }} 
            />
          </div>
        )}
        
        <div className="create-post-actions">
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !content.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost

