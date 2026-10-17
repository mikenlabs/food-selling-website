import { products as mockProducts, categories as mockCategories } from '../mock/products'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getClient() {
  const { supabase } = await import('./supabaseClient')
  return supabase
}

class ProductService {
  constructor() {
    this.useMock = !import.meta.env.VITE_SUPABASE_URL
  }

  async getCategories() {
    const client = await getClient()
    if (!client || this.useMock) {
      await delay(200)
      return { data: mockCategories, error: null }
    }
    const { data, error } = await client.from('categories').select('*')
    return { data, error }
  }

  async getProducts({ category, search, sort, limit, offset } = {}) {
    const client = await getClient()
    if (!client || this.useMock) {
      await delay(300)
      let result = [...mockProducts]
      if (category) result = result.filter((p) => p.category_id === category)
      if (search) {
        const q = search.toLowerCase()
        result = result.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        )
      }
      if (sort === 'price_asc') result.sort((a, b) => a.price - b.price)
      else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price)
      else if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
      if (limit) result = result.slice(0, limit + (offset || 0))
      return { data: result, error: null, count: result.length }
    }
    let query = client.from('products').select('*')
    if (category) query = query.eq('category_id', category)
    if (search) query = query.ilike('name', `%${search}%`)
    if (sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price', { ascending: false })
    else if (sort === 'name') query = query.order('name')
    if (limit) query = query.limit(limit)
    const { data, error, count } = await query
    return { data, error, count }
  }

  async getProduct(id) {
    const client = await getClient()
    if (!client || this.useMock) {
      await delay(200)
      const product = mockProducts.find((p) => p.id === id)
      return { data: product || null, error: product ? null : { message: 'Not found' } }
    }
    const { data, error } = await client.from('products').select('*').eq('id', id).single()
    return { data, error }
  }

  async getRelatedProducts(categoryId, excludeId, limit = 4) {
    const client = await getClient()
    if (!client || this.useMock) {
      await delay(200)
      const result = mockProducts
        .filter((p) => p.category_id === categoryId && p.id !== excludeId)
        .slice(0, limit)
      return { data: result, error: null }
    }
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .neq('id', excludeId)
      .limit(limit)
    return { data, error }
  }

  async createProduct(product) {
    const client = await getClient()
    if (!client) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await client.from('products').insert(product).select().single()
    return { data, error }
  }

  async updateProduct(id, updates) {
    const client = await getClient()
    if (!client) return { data: null, error: { message: 'Supabase not configured' } }
    const { data, error } = await client.from('products').update(updates).eq('id', id).select().single()
    return { data, error }
  }

  async deleteProduct(id) {
    const client = await getClient()
    if (!client) return { error: { message: 'Supabase not configured' } }
    const { error } = await client.from('products').delete().eq('id', id)
    return { error }
  }
}

export default new ProductService()