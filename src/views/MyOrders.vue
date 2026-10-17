<template>
  <div class="mb-8">
    <h1 class="font-poppins font-bold text-2xl text-gray-800 mb-6">My Orders</h1>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse h-24 bg-gray-200 rounded-xl"></div>
    </div>

    <EmptyState v-else-if="!orders.length" title="No orders yet" message="You haven't placed any orders." />

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="border rounded-xl p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-poppins font-bold text-lg">Order #{{ order.id }}</h3>
            <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="statusClasses(order.status)"
            >{{ order.status }}</span>
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="paymentStatusClasses(order.payment_status)"
            >{{ order.payment_status }}</span>
          </div>
        </div>

        <div class="border-t pt-4">
          <div v-for="item in order.items || []" :key="item.id" class="flex justify-between py-2">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>{{ formatCurrency(item.price * item.quantity) }}</span>
          </div>
          <div class="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>{{ formatCurrency(order.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import orderService from '../services/orderService'
import { formatCurrency } from '../utils'
import EmptyState from '../components/ui/EmptyState.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()
const { user } = storeToRefs(authStore)

const orders = ref([])
const loading = ref(true)

const statusClasses = (status) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'paid': return 'bg-blue-100 text-blue-800'
    case 'preparing': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const paymentStatusClasses = (status) => {
  return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const { data, error } = await orderService.getOrders(user.value?.id)
    if (error) throw error
    orders.value = data || []
  } catch (e) {
    uiStore.addToast('Failed to load orders', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (user.value?.id) fetchOrders()
})
</script>
