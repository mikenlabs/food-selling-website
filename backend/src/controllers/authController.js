import supabase from '../config/supabase.js'

class AuthController {
  async register(req, res) {
    try {
      const { email, password, full_name, phone } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) return res.status(400).json({ error: signUpError.message })

      if (user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: user.id,
          full_name,
          phone: phone || null,
          role: 'customer',
        })

        if (profileError) return res.status(400).json({ error: profileError.message })
      }

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: user.id, email: user.email },
      })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return res.status(401).json({ error: error.message })

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      res.json({
        message: 'Login successful',
        user,
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_in: session.expires_in,
        },
        profile,
      })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async logout(req, res) {
    try {
      const { error } = await supabase.auth.admin.signOut(req.body.refresh_token)

      if (error) return res.status(400).json({ error: error.message })

      res.json({ message: 'Logged out successfully' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async me(req, res) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) return res.status(401).json({ error: 'Not authenticated' })

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      res.json({ user, profile })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async refreshToken(req, res) {
    try {
      const { refresh_token } = req.body

      const { data: { session }, error } = await supabase.auth.refreshSession({
        refresh_token,
      })

      if (error) return res.status(401).json({ error: error.message })

      res.json({ session })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}

export default new AuthController()