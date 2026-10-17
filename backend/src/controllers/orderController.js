import supabase from '../config/supabase.js'

class OrderController {
  async create(req, res) {
    try {
      const { user_id, total, status, payment_status, delivery_address, phone, items } = req.body

      const orderData = {
        user_id: user_id || req.user?.id,
        total,
        status: 'pending',
        payment_status,
        delivery_address,
        phone,
        created_at: new Date().toISOString(),
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) return res.status(400).json({ error: orderError.message })

      if (items && items.length > 0) {
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

        if (itemsError) return res.status(400).json({ error: itemsError.message })
      }

      res.status(201).json({ data: order })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async getAll(req, res) {
    try {
      const { status } = req.query
      let query = supabase.from('orders').select('*')

      if (status) query = query.eq('status', status)

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) return res.status(400).json({ error: error.message })

      res.json({ data })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async getByUser(req, res) {
    try {
      const userId = req.params.userId || req.user?.id

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) return res.status(400).json({ error: error.message })

      for (const order of orders) {
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id)
        order.items = items || []
      }

      res.json({ data: orders })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async getById(req, res) {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', req.params.id)
        .single()

      if (orderError || !order) return res.status(404).json({ error: 'Order not found' })

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', req.params.id)

      order.items = items || []

      res.json({ data: order })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body

      const validStatuses = ['pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' })
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', req.params.id)
        .select()
        .single()

      if (error || !data) return res.status(404).json({ error: 'Order not found' })

      res.json({ data })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async delete(req, res) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', req.params.id)

      if (error) return res.status(400).json({ error: error.message })

      res.json({ message: 'Order deleted successfully' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}

export default new OrderController()