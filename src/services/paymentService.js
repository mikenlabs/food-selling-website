const API_URL = import.meta.env.VITE_API_URL || ''

class PaymentService {
  async initializePayment(orderId, amount, email, metadata = {}) {
    if (!API_URL) {
      // Mock payment for development
      return {
        success: true,
        reference: `mock_ref_${Date.now()}`,
        authorization_url: `https://checkout.paystack.com/test?mock=true&order=${orderId}`,
      }
    }
    try {
      const response = await fetch(`${API_URL}/payments/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount, email, metadata }),
      })
      const data = await response.json()
      return data
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  async verifyPayment(reference) {
    if (!API_URL) {
      return { success: true, reference, status: 'success' }
    }
    try {
      const response = await fetch(`${API_URL}/payments/verify/${reference}`)
      const data = await response.json()
      return data
    } catch (e) {
      return { success: false, error: e.message }
    }
  }
}

export default new PaymentService()