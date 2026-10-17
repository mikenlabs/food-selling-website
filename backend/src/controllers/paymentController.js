import supabase from '../config/supabase.js'
import paymentService from '../services/paymentService.js'
import { config } from '../config/environment.js'

class PaymentController {
  async initialize(req, res) {
    try {
      const { orderId, amount, email, provider, metadata = {} } = req.body

      if (!orderId || !amount || !email) {
        return res.status(400).json({ error: 'Order ID, amount, and email are required' })
      }

      const orderCheck = await supabase
        .from('orders')
        .select('total')
        .eq('id', orderId)
        .single()

      if (!orderCheck.data) {
        return res.status(404).json({ error: 'Order not found' })
      }

      let result

      if (provider === 'flutterwave') {
        result = await paymentService.initializeFlutterwave(orderId, orderCheck.data.total, email, metadata)
      } else {
        result = await paymentService.initializePaystack(orderId, orderCheck.data.total, email, metadata)
      }

      if (result.success) {
        await supabase
          .from('orders')
          .update({ payment_ref: result.reference })
          .eq('id', orderId)

        return res.json({
          success: true,
          reference: result.reference,
          authorization_url: result.authorization_url,
          payment_link: result.payment_link,
        })
      }

      res.status(400).json({ error: result.error })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async verify(req, res) {
    try {
      const { reference } = req.params
      const { provider } = req.query || {}

      if (!reference) {
        return res.status(400).json({ error: 'Payment reference is required' })
      }

      let result

      if (provider === 'flutterwave') {
        result = await paymentService.verifyFlutterwave(reference)
      } else {
        result = await paymentService.verifyPaystack(reference)
      }

      if (!result.success) {
        return res.status(400).json({ error: result.error, status: result.status })
      }

      const order = await supabase
        .from('orders')
        .select('*')
        .eq('payment_ref', reference)
        .single()

      if (order.data) {
        await supabase
          .from('orders')
          .update({ payment_status: 'paid', status: 'confirmed' })
          .eq('id', order.data.id)
      }

      res.json({
        success: true,
        status: result.status,
        amount: result.amount,
        order: order.data,
      })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  async webhook(req, res) {
    try {
      const signature = req.body
      const event = req.body.event

      if (event && event.type === 'charge.success') {
        const reference = event.data.reference

        const order = await supabase
          .from('orders')
          .select('*')
          .eq('payment_ref', reference)
          .single()

        if (order.data) {
          await supabase
            .from('orders')
            .update({ payment_status: 'paid', status: 'confirmed' })
            .eq('id', order.data.id)
        }
      }

      res.json({ received: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}

export default new PaymentController()