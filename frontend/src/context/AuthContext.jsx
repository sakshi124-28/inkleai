import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    // Check for existing session
    if (token) {
      fetchProfile(token)
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchProfile = async (authToken) => {
    try {
      const response = await fetch('/api/v1/profiles/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      if (response.ok) {
        const profileData = await response.json()
        console.log('✅ Fetched profile:', profileData)
        console.log('✅ Profile role:', profileData.role)
        console.log('✅ Is Admin/Owner:', profileData.role === 'admin' || profileData.role === 'owner')
        setProfile(profileData)
        setUser({ id: profileData.id })
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Profile fetch failed:', response.status, errorData)
        // Token invalid, clear it
        localStorage.removeItem('token')
        setToken(null)
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
      // Don't clear token on network errors, just set loading to false
      // Only clear if it's an auth error
      if (error.message && !error.message.includes('Failed to fetch')) {
        localStorage.removeItem('token')
        setToken(null)
      }
    } finally {
      setLoading(false)
    }
  }

  // Add refresh profile function
  const refreshProfile = async () => {
    const currentToken = localStorage.getItem('token')
    if (currentToken) {
      setLoading(true)
      await fetchProfile(currentToken)
    } else {
      console.warn('⚠️ No token found for refresh')
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      const authToken = data.session?.access_token
      if (authToken) {
        localStorage.setItem('token', authToken)
        setToken(authToken)
        setUser(data.user)
        setProfile(data.profile)
        return { success: true }
      } else {
        throw new Error('No token received')
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (email, password, username, displayName, bio) => {
    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          username,
          display_name: displayName,
          bio
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      const authToken = data.session?.access_token
      if (authToken) {
        localStorage.setItem('token', authToken)
        setToken(authToken)
        setUser(data.user)
        setProfile(data.profile)
        return { success: true }
      } else {
        // If no token but user was created, they need to confirm email
        if (data.user && data.requiresEmailConfirmation) {
          return { 
            success: false, 
            error: 'Please check your email to confirm your account, then try logging in.' 
          }
        }
        // Try to auto-login if user was created
        if (data.user) {
          // Attempt to login with the same credentials
          return await login(email, password)
        }
        throw new Error('No token received. Please try logging in.')
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setProfile(null)
  }

  const value = {
    user,
    profile,
    loading,
    token,
    login,
    signup,
    logout,
    refreshProfile,
    isAuthenticated: !!token && !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

