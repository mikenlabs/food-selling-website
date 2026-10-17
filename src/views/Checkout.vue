<template>
  <div class="mb-8">
    <h1 class="font-poppins font-bold text-2xl text-gray-800 mb-6">Checkout</h1>

    <div v-if="!cartStore.items.length" class="text-center py-12">
      <p class="text-gray-500">Your cart is empty.</p>
      <router-link to="/shop" class="btn btn-primary mt-4">Continue Shopping</router-link>
    </div>

    <div v-else class="grid lg:grid-cols-2 gap-8">
      <!-- Checkout Form -->
      <div>
        <h2 class="font-poppins font-bold text-lg text-gray-700 mb-4">Delivery Information</h2>
        <form @submit.prevent="handleCheckout" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input v-model="form.fullName" type="text" class="input-field w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input v-model="form.phone" type="tel" class="input-field w-full" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
            <textarea v-model="form.address" rows="3" class="input-field w-full" required></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
              <input v-model="form.notes" type="text" class="input-field w-full" placeholder="Special instructions..." />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select v-model="form.paymentMethod" class="input-field w-full">
                <option value="cod">Cash on Delivery</option>
                <option value="paystack">Paystack</option>
                <option value="flutterwave">Flutterwave</option>
              </select>
            </div>
          </div>

          <div class="pt-6 border-t">
            <p class="text-xs text-gray-500 mb-2">
              Note: All prices are in Nigerian Naira (₦). The server will verify prices before finalizing your order.
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading || !form.fullName || !form.phone || !form.address"
            class="btn btn-primary w-full py-3"
          >
            <span v-if="loading">Processing...</span>
            <span v-else>Place Order - {{ formatCurrency(total) }}</span>
          </button>
        </form>
      </div>

      <!-- Order Summary -->
      <div>
        <h2 class="font-poppins font-bold text-lg text-gray-700 mb-4">Order Summary</h2>
        <div class="bg-gray-50 rounded-xl p-6 space-y-3">
          <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between">
            <span class="text-sm">{{ item.name }} x {{ item.quantity }}</span>
            <span class="text-sm">{{ formatCurrency(item.price * item.quantity) }}</span>
          </div>
          <div class="border-t pt-3 space-y-2">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{{ formatCurrency(cartStore.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>{{ deliveryFee > 0 ? formatCurrency(deliveryFee) : 'FREE' }}</span>
            </div>
            <div class="flex justify-between font-bold text-xl pt-2 border-t">
              <span>Total</span>
              <span class="text-primary-600">{{ formatCurrency(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import orderService from '../services/orderService'
import paymentService from '../services/paymentService'
import { formatCurrency } from '../utils'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

const { items: cartItems, subtotal } = storeToRefs(cartStore)

const loading = ref(false)
const form = ref({
  fullName: '',
  phone: '',
  address: '',
  notes: '',
  paymentMethod: 'cod',
})

const deliveryFee = computed(() => subtotal.value >= 5000 ? 0 : 1000)
const total = computed(() => subtotal.value + deliveryFee.value)

const handleCheckout = async () => {
  loading.value = true
  try {
    const orderData = {
      user_id: authStore.user?.id,
      total: total.value,
      status: 'pending',
      payment_status: 'pending',
      delivery_address: form.value.address,
      phone: form.value.phone,
      payment_method: form.value.paymentMethod,
      items: cartStore.items.map((i) => ({
        product_id: i.id,
        quantity: i.quantity,
        unit_price: i.price,
      })),
    }

    const { data: order, error } = await orderService.createOrder(orderData)
    if (error) throw new Error(error.message || 'Failed to create order')

    if (form.value.paymentMethod !== 'cod') {
      const { success, authorization_url, error: paymentError } = await paymentService.initializePayment(
        order.id,
        total.value,
        authStore.user?.email,
        { ...form.value }
      )

      if (paymentError) throw new Error(paymentError)

      if (success && authorization_url) {
        window.location.href = authorization_url
        return
      }
    }

    cartStore.clearCart()
    uiStore.addToast('Order placed successfully!', 'success')
    router.push(`/order-success/${order.id}`)
  } catch (e) {
    uiStore.addToast('Failed to place order: ' + e.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style>
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500;
}
.btn {
  @apply flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200;
}
.btn-primary {
  @apply bg-primary-500 text-white hover:bg-primary-600;
}
.btn-outline {
  @apply bg-white text-primary-600 border border-primary-500 hover:bg-primary-50;
}
</style>
