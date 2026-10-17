import supabase from '../config/supabase.js'

class CategoryController {
  async getAll(req, res) {
    try {
      const { data, error } = await supabase.from('categories').select('*')

      if (error) return res.status(400).json({ error: error.message })

      res.json({ data })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async getById(req, res) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', req.params.id)
        .single()

      if (error || !data) return res.status(404).json({ error: 'Category not found' })

      res.json({ data })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async create(req, res) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(req.body)
        .select()
        .single()

      if (error) return res.status(400).json({ error: error.message })

      res.status(201).json({ data })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async update(req, res) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single()

      if (error || !data) return res.status(404).json({ error: 'Category not found' })

      res.json({ data })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async delete(req, res) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', req.params.id)

      if (error) return res.status(400).json({ error: error.message })

      res.json({ message: 'Category deleted successfully' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}

export default new CategoryController()