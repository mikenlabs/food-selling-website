import supabase from '../config/supabase.js'
import { config } from '../config/environment.js'
import axios from 'axios'

class PaymentService {
  constructor() {
    this.paystackSecret = config.paystackSecretKey
    this.flutterwaveSecret = config.flutterwaveSecretKey
    this.supabase = supabase
  }

  async initializePaystack(orderId, amount, email, metadata = {}) {
    if (!this.paystackSecret) {
      return { success: false, error: 'Paystack not configured' }
    }

    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: Math.round(amount * 100),
          metadata: {
            orderId,
            ...metadata,
          },
          callback_url: `${config.frontendUrl}/order-success/${orderId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecret}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        reference: response.data.data.reference,
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
      }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  async verifyPaystack(reference) {
    if (!this.paystackSecret) {
      return { success: false, error: 'Paystack not configured' }
    }

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecret}`,
          },
        }
      )

      const data = response.data.data
      return {
        success: data.status === 'success',
        reference: data.reference,
        amount: data.amount / 100,
        status: data.status,
      }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  async initializeFlutterwave(orderId, amount, email, metadata = {}) {
    if (!this.flutterwaveSecret) {
      return { success: false, error: 'Flutterwave not configured' }
    }

    try {
      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref: `chisoms-kitchen-${orderId}-${Date.now()}`,
          amount,
          currency: 'NGN',
          redirect_url: `${config.frontendUrl}/order-success/${orderId}`,
          customer: { email },
          meta: { orderId, ...metadata },
          customizations: {
            title: 'Chisom\'s Kitchen',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.flutterwaveSecret}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        reference: response.data.data.id,
        payment_link: response.data.data.link,
      }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  async verifyFlutterwave(transactionId) {
    if (!this.flutterwaveSecret) {
      return { success: false, error: 'Flutterwave not configured' }
    }

    try {
      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.flutterwaveSecret}`,
          },
        }
      )

      const data = response.data.data
      return {
        success: data.status === 'successful',
        reference: data.id,
        amount: parseFloat(data.amount),
        status: data.status,
      }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  async verifyOrderPayment(orderRef, provider) {
    const order = await this.supabase
      .from('orders')
      .select('*')
      .eq('payment_ref', orderRef)
      .single()

    if (!order.data) {
      return { success: false, error: 'Order not found' }
    }

    let paymentResult
    if (provider === 'flutterwave') {
      paymentResult = await this.verifyFlutterwave(orderRef)
    } else {
      paymentResult = await this.verifyPaystack(orderRef)
    }

    if (paymentResult.success) {
      await this.supabase
        .from('orders')
        .update({ payment_status: 'paid', status: 'confirmed' })
        .eq('id', order.data.id)

      return { success: true, order: order.data, payment: paymentResult }
    }

    return { success: false, error: paymentResult.error, order: order.data }
  }
}

export default new PaymentService()