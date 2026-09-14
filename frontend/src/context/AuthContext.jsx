import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem('resumeiq_access')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get('/auth/me/')
      setUser(data)
    } catch {
      localStorage.removeItem('resumeiq_access')
      localStorage.removeItem('resumeiq_refresh')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  function storeTokens(tokens) {
    localStorage.setItem('resumeiq_access', tokens.access)
    localStorage.setItem('resumeiq_refresh', tokens.refresh)
  }

  async function register({ email, password, fullName, nickname }) {
    const { data } = await api.post('/auth/register/', {
      email, password, full_name: fullName || nickname || '',
    })
    storeTokens(data.tokens)
    setUser(data.user)
    return data.user
  }

  async function login({ email, password }) {
    const { data } = await api.post('/auth/login/', { email, password })
    storeTokens(data.tokens)
    setUser(data.user)
    return data.user
  }

  async function loginWithGoogle(idToken) {
    const { data } = await api.post('/auth/google/', { id_token: idToken })
    storeTokens(data.tokens)
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('resumeiq_access')
    localStorage.removeItem('resumeiq_refresh')
    setUser(null)
  }

  const displayName = user
    ? (user.first_name || user.profile?.nickname || user.email?.split('@')[0])
    : null

  return (
    <AuthContext.Provider value={{ user, displayName, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
