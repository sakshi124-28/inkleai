import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

// Use environment variable for API URL, fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Supabase client (if needed for direct client-side operations)
// Only initialize if env vars are provided, otherwise create a dummy client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

// API client with auth
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export const api = {
  // Auth
  signup: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, data)
    return response.data
  },

  login: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data)
    return response.data
  },

  // Profiles
  getMyProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/profiles/me`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  getProfile: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/profiles/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  updateProfile: async (id, data) => {
    const response = await axios.patch(`${API_BASE_URL}/profiles/${id}`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  // Posts
  createPost: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/posts`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  getPosts: async (limit = 50, offset = 0) => {
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      params: { limit, offset },
      headers: getAuthHeaders()
    })
    return response.data
  },

  getPost: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/posts/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  deletePost: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/posts/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  // Likes
  likePost: async (postId) => {
    const response = await axios.post(
      `${API_BASE_URL}/posts/${postId}/like`,
      {},
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  unlikePost: async (postId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/posts/${postId}/like`,
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  // Follows
  followUser: async (userId) => {
    const response = await axios.post(
      `${API_BASE_URL}/profiles/${userId}/follow`,
      {},
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  unfollowUser: async (userId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/profiles/${userId}/follow`,
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  // Blocks
  blockUser: async (userId) => {
    const response = await axios.post(
      `${API_BASE_URL}/profiles/${userId}/block`,
      {},
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  unblockUser: async (userId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/profiles/${userId}/block`,
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  // Activities
  getActivities: async (limit = 50, offset = 0) => {
    const response = await axios.get(`${API_BASE_URL}/activities`, {
      params: { limit, offset },
      headers: getAuthHeaders()
    })
    return response.data
  },

  // Admin - Users
  getUsers: async (limit = 50, offset = 0, search = '') => {
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      params: { limit, offset, search },
      headers: getAuthHeaders()
    })
    return response.data
  },

  getUserDetails: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/users/${userId}`,
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  // Admin - Posts
  getAllPosts: async (limit = 50, offset = 0, search = '') => {
    const response = await axios.get(`${API_BASE_URL}/admin/posts`, {
      params: { limit, offset, search },
      headers: getAuthHeaders()
    })
    return response.data
  },

  getPostLikers: async (postId) => {
    const response = await axios.get(`${API_BASE_URL}/admin/posts/${postId}/likers`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  getPostDetails: async (postId) => {
    const response = await axios.get(`${API_BASE_URL}/admin/posts/${postId}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  // Admin - Likes
  getAllLikes: async (limit = 50, offset = 0) => {
    const response = await axios.get(`${API_BASE_URL}/admin/likes`, {
      params: { limit, offset },
      headers: getAuthHeaders()
    })
    return response.data
  },

  getLikeDetails: async (likeId) => {
    const response = await axios.get(`${API_BASE_URL}/admin/likes/${likeId}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  deleteLike: async (likeId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/likes/${likeId}`,
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  // Admin - Stats
  getAdminStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  // Owner - Admins
  getAdmins: async () => {
    const response = await axios.get(`${API_BASE_URL}/owner/admins`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  createAdmin: async (userId) => {
    const response = await axios.post(
      `${API_BASE_URL}/owner/admins`,
      { user_id: userId },
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  removeAdmin: async (userId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/owner/admins/${userId}`,
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  // Owner - Stats
  getOwnerStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/owner/stats`, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}

