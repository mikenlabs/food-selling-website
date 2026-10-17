import supabase from '../config/supabase.js'

class ProductController {
  async getAll(req, res) {
    try {
      const { category, search, sort, limit = 20, offset = 0 } = req.query

      let query = supabase.from('products').select('*', { count: 'exact' })

      if (category) query = query.eq('category_id', category)
      if (search) query = query.ilike('name', `%${search}%`)

      if (sort === 'price_asc') query = query.order('price', { ascending: true })
      else if (sort === 'price_desc') query = query.order('price', { ascending: false })
      else if (sort === 'name') query = query.order('name')

      if (limit) query = query.limit(parseInt(limit)).range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

      const { data, error, count } = await query

      if (error) return res.status(400).json({ error: error.message })

      res.json({ data, count })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async getById(req, res) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', req.params.id)
        .single()

      if (error || !data) return res.status(404).json({ error: 'Product not found' })

      res.json({ data })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async create(req, res) {
    try {
      const { data, error } = await supabase
        .from('products')
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
        .from('products')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single()

      if (error || !data) return res.status(404).json({ error: 'Product not found' })

      res.json({ data })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async delete(req, res) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id)

      if (error) return res.status(400).json({ error: error.message })

      res.json({ message: 'Product deleted successfully' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async uploadImage(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

      const fileName = `${Date.now()}-${req.file.originalname}`
      const { data, error } = await supabase.storage
        .from('food-images')
        .upload(fileName, req.file.buffer)

      if (error) return res.status(400).json({ error: error.message })

      res.json({ url: data.path })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}

export default new ProductController()