import { ref } from 'vue'

const orders = ref([])

class OrderService {
  constructor() {
    this.useMock = !import.meta.env.VITE_SUPABASE_URL
  }

  async createOrder(orderData) {
    if (this.useMock) {
      const newOrder = {
        id: 'ord_' + Date.now(),
        ...orderData,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
      }
      orders.value.push(newOrder)
      return { data: newOrder, error: null }
    }
    const { supabase } = await import('./supabaseClient')
    const { data, error } = await supabase.from('orders').insert(orderData).select().single()
    return { data, error }
  }

  async getOrders(userId) {
    if (this.useMock) {
      const userOrders = orders.value.filter((o) => o.user_id === userId)
      return { data: userOrders, error: null }
    }
    const { supabase } = await import('./supabaseClient')
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }

  async getAllOrders() {
    if (this.useMock) {
      return { data: [...orders.value], error: null }
    }
    const { supabase } = await import('./supabaseClient')
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  }

  async updateOrderStatus(orderId, status) {
    if (this.useMock) {
      const order = orders.value.find((o) => o.id === orderId)
      if (order) {
        order.status = status
        if (status === 'paid') order.payment_status = 'paid'
      }
      return { data: order, error: null }
    }
    const { supabase } = await import('./supabaseClient')
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()
    return { data, error }
  }

  async getOrder(orderId) {
    if (this.useMock) {
      const order = orders.value.find((o) => o.id === orderId)
      return { data: order || null, error: order ? null : { message: 'Not found' } }
    }
    const { supabase } = await import('./supabaseClient')
    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single()
    return { data, error }
  }
}

export default new OrderService()