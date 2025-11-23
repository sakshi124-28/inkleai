import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import './Profile.css'

const Profile = () => {
  const { id } = useParams()
  const { profile: currentProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await api.getProfile(id)
      setProfile(data)
      // TODO: Check if following/blocked
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      await api.followUser(id)
      setIsFollowing(true)
      loadProfile()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to follow user')
    }
  }

  const handleUnfollow = async () => {
    try {
      await api.unfollowUser(id)
      setIsFollowing(false)
      loadProfile()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to unfollow user')
    }
  }

  const handleBlock = async () => {
    try {
      await api.blockUser(id)
      setIsBlocked(true)
      alert('User blocked')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to block user')
    }
  }

  if (loading) {
    return <div className="container">Loading profile...</div>
  }

  if (error) {
    return <div className="container error-message">{error}</div>
  }

  if (!profile) {
    return <div className="container">Profile not found</div>
  }

  const isOwnProfile = currentProfile?.id === id
  const isAdmin = currentProfile?.role === 'admin' || currentProfile?.role === 'owner'

  return (
    <div className="container page-container">
      <div className="profile-card">
        <div className="profile-header">
          {profile.avatar_url && (
            <img src={profile.avatar_url} alt={profile.display_name} className="profile-avatar" />
          )}
          <div className="profile-info">
            <h1>{profile.display_name || profile.username}</h1>
            <p className="profile-username">@{profile.username}</p>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          </div>
        </div>

        {!isOwnProfile && (
          <div className="profile-actions">
            {!isBlocked ? (
              <>
                {isFollowing ? (
                  <button onClick={handleUnfollow} className="btn btn-secondary">
                    Unfollow
                  </button>
                ) : (
                  <button onClick={handleFollow} className="btn btn-primary">
                    Follow
                  </button>
                )}
                <button onClick={handleBlock} className="btn btn-danger">
                  Block
                </button>
              </>
            ) : (
              <p>This user is blocked</p>
            )}
          </div>
        )}

        {isOwnProfile && (
          <div className="profile-actions">
            <button className="btn btn-secondary">Edit Profile</button>
          </div>
        )}

        {isAdmin && !isOwnProfile && (
          <div className="profile-actions">
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this user?')) {
                  try {
                    await api.deleteUser(id)
                    alert('User deleted')
                  } catch (err) {
                    alert(err.response?.data?.error || 'Failed to delete user')
                  }
                }
              }}
              className="btn btn-danger"
            >
              Delete User (Admin)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

