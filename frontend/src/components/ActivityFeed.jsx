import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import PostCard from './PostCard'
import './ActivityFeed.css'

const ActivityFeed = ({ activities, onRefresh, posts = [] }) => {
  const [postMap, setPostMap] = useState({})
  const [loadingPosts, setLoadingPosts] = useState({})

  useEffect(() => {
    // Create a map of post IDs to post objects for quick lookup
    const map = {}
    posts.forEach(post => {
      if (post && post.id) {
        map[post.id] = post
      }
    })
    setPostMap(map)
  }, [posts])

  // Fetch posts for activities that don't have post data
  useEffect(() => {
    const fetchMissingPosts = async () => {
      const postActivities = activities.filter(
        a => a.verb === 'created' && 
        a.object_type === 'post' && 
        a.object_id && 
        !postMap[a.object_id] &&
        !loadingPosts[a.object_id]
      )

      if (postActivities.length === 0) return

      // Mark as loading
      const newLoading = { ...loadingPosts }
      postActivities.forEach(a => {
        newLoading[a.object_id] = true
      })
      setLoadingPosts(newLoading)

      // Fetch posts
      const fetchPromises = postActivities.map(async (activity) => {
        try {
          const post = await api.getPost(activity.object_id)
          return { id: activity.object_id, post }
        } catch (err) {
          console.error('Error fetching post:', err)
          return { id: activity.object_id, post: null }
        }
      })

      const results = await Promise.all(fetchPromises)
      const newPostMap = { ...postMap }
      results.forEach(({ id, post }) => {
        if (post) {
          newPostMap[id] = post
        }
      })
      setPostMap(newPostMap)

      // Clear loading
      const clearedLoading = { ...loadingPosts }
      postActivities.forEach(a => {
        delete clearedLoading[a.object_id]
      })
      setLoadingPosts(clearedLoading)
    }

    fetchMissingPosts()
  }, [activities, postMap, loadingPosts])

  const formatActivity = (activity) => {
    const actor = activity.actor
    const actorName = actor?.display_name || actor?.username || 'Unknown'
    const timestamp = new Date(activity.created_at).toLocaleString()

    switch (activity.verb) {
      case 'created':
        if (activity.object_type === 'post') {
          return {
            type: 'post',
            message: `${actorName} created a post`,
            timestamp,
            postId: activity.object_id
          }
        } else if (activity.object_type === 'profile') {
          return {
            type: 'info',
            message: `${actorName} joined`,
            timestamp
          }
        }
        break
      case 'liked':
        return {
          type: 'info',
          message: `${actorName} liked a post`,
          timestamp,
          postId: activity.object_id
        }
      case 'followed':
        return {
          type: 'info',
          message: `${actorName} followed ${activity.target_id ? 'a user' : 'someone'}`,
          timestamp
        }
      case 'blocked':
        return {
          type: 'info',
          message: `${actorName} blocked a user`,
          timestamp
        }
      case 'deleted':
        return {
          type: 'info',
          message: `${actorName} (${activity.metadata?.deleted_by_role || 'user'}) deleted ${activity.object_type}`,
          timestamp
        }
      case 'promoted':
        return {
          type: 'info',
          message: `${actorName} promoted a user to admin`,
          timestamp
        }
      case 'demoted':
        return {
          type: 'info',
          message: `${actorName} demoted an admin to user`,
          timestamp
        }
      default:
        return {
          type: 'info',
          message: `${actorName} ${activity.verb} ${activity.object_type}`,
          timestamp
        }
    }

    return {
      type: 'info',
      message: 'Activity',
      timestamp
    }
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="activity-feed-empty">
        <p>No activities yet. Be the first to post!</p>
      </div>
    )
  }

  return (
    <div className="activity-feed">
      {activities.map((activity) => {
        const formatted = formatActivity(activity)

        if (formatted.type === 'post' && formatted.postId) {
          // Show post card if we have the post data
          const post = postMap[formatted.postId]
          if (post) {
            return (
              <div key={activity.id} className="activity-with-post stagger-item">
                <div className="activity-header">
                  <div className="activity-message">
                    <Link to={`/profile/${activity.actor?.id}`} className="activity-actor">
                      {activity.actor?.display_name || activity.actor?.username}
                    </Link>
                    {' '}created a post
                  </div>
                  <div className="activity-time">{formatted.timestamp}</div>
                </div>
                <PostCard post={post} />
              </div>
            )
          }
          
          // Fallback: show activity message with link to post
          return (
            <div key={activity.id} className="activity-item">
              <div className="activity-message">
                <Link to={`/profile/${activity.actor?.id}`} className="activity-actor">
                  {activity.actor?.display_name || activity.actor?.username}
                </Link>
                {' '}created a post
                {formatted.postId && (
                  <Link to={`/posts/${formatted.postId}`} className="activity-link">
                    {' '}View Post →
                  </Link>
                )}
              </div>
              <div className="activity-time">{formatted.timestamp}</div>
            </div>
          )
        }

        return (
          <div key={activity.id} className="activity-item stagger-item">
            <div className="activity-message">
              <Link to={`/profile/${activity.actor?.id}`} className="activity-actor">
                {activity.actor?.display_name || activity.actor?.username || 'Unknown'}
              </Link>
              {' '}
              {formatted.message.replace(activity.actor?.display_name || activity.actor?.username || 'Unknown', '')}
              {formatted.postId && (
                <Link to={`/posts/${formatted.postId}`} className="activity-link">
                  {' '}View →
                </Link>
              )}
            </div>
            <div className="activity-time">{formatted.timestamp}</div>
          </div>
        )
      })}
    </div>
  )
}

export default ActivityFeed

