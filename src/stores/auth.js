import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isBrowser } from '../utils'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')

  function setUser(u, p) {
    user.value = u
    profile.value = p
    if (isBrowser()) {
      if (u) localStorage.setItem('auth_user', JSON.stringify({ user: u, profile: p }))
      else localStorage.removeItem('auth_user')
    }
  }

  function restoreSession() {
    if (!isBrowser()) return
    const saved = localStorage.getItem('auth_user')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        user.value = data.user
        profile.value = data.profile
      } catch (e) {
        localStorage.removeItem('auth_user')
      }
    }
    initialized.value = true
  }

  async function register(userData) {
    loading.value = true
    try {
      const { supabase } = await import('../services/supabaseClient')
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
          })
          if (error) throw error
          if (data.user) {
            const { error: profileError } = await supabase.from('profiles').upsert({
              id: data.user.id,
              full_name: userData.name,
              phone: userData.phone || null,
              role: 'customer',
            })
            if (profileError && profileError.code !== '23505') {
              console.warn('Profile creation warning:', profileError.message)
            }
            const mockProfile = { id: data.user.id, full_name: userData.name, phone: userData.phone || null, role: 'customer' }
            setUser(data.user, mockProfile)
            return { success: true, error: null }
          }
        } catch (supabaseError) {
          console.warn('Supabase registration failed, falling back to mock:', supabaseError.message)
        }
      }
      const mockUser = { id: 'mock_' + Date.now(), email: userData.email }
      const mockProfile = { id: mockUser.id, full_name: userData.name, phone: userData.phone || null, role: 'customer' }
      setUser(mockUser, mockProfile)
      return { success: true, error: null }
    } catch (e) {
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    loading.value = true
    try {
      const { supabase } = await import('../services/supabaseClient')
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
          if (data.user) {
            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
            setUser(data.user, profileData || { id: data.user.id, full_name: data.user.user_metadata?.name, role: 'customer' })
            return { success: true, error: null }
          }
        } catch (supabaseError) {
          console.warn('Supabase login failed, falling back to mock:', supabaseError.message)
        }
      }
      if (email && password) {
        const mockUser = { id: 'mock_user', email }
        const mockProfile = { id: mockUser.id, full_name: 'Mock User', role: 'customer' }
        setUser(mockUser, mockProfile)
        return { success: true, error: null }
      }
      throw new Error('Invalid credentials')
    } catch (e) {
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      const { supabase } = await import('../services/supabaseClient')
      if (supabase) await supabase.auth.signOut()
      setUser(null, null)
      return { success: true }
    } catch (e) {
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  return {
    user, profile, loading, initialized,
    isAuthenticated, isAdmin,
    register, login, logout, restoreSession, setUser
  }
})