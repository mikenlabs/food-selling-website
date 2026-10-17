import supabase from './supabaseClient'

class AuthService {
  async signUp(email, password, userData = {}) {
    if (!supabase) {
      // Mock registration
      const user = { id: 'mock_' + Date.now(), email }
      return { data: { user }, error: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })

    if (data?.user && !error) {
      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        ...userData,
        role: 'customer',
      })
    }

    return { data, error }
  }

  async signIn(email, password) {
    if (!supabase) {
      if (email && password) {
        return { data: { user: { id: 'mock_user', email } }, error: null }
      }
      return { data: null, error: { message: 'Invalid credentials' } }
    }
    return supabase.auth.signInWithPassword({ email, password })
  }

  async signOut() {
    if (!supabase) {
      return { error: null }
    }
    return supabase.auth.signOut()
  }

  async getSession() {
    if (!supabase) {
      return { data: { session: null }, error: null }
    }
    return supabase.auth.getSession()
  }

  async getUserProfile(userId) {
    if (!supabase) {
      return { data: null, error: null }
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  }

  onAuthStateChange(callback) {
    if (!supabase) {
      return () => {}
    }
    return supabase.auth.onAuthStateChange(callback)
  }
}

export default new AuthService()