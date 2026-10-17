<template>
  <div class="flex min-h-screen bg-gray-50">
    <AdminSidebar />
    <div class="flex-1 p-8 overflow-auto">
      <h1 class="font-poppins font-bold text-2xl text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl p-4 shadow">
          <p class="text-2xl font-bold text-primary-600">{{ stats.totalProducts }}</p>
          <p class="text-sm text-gray-600">Products</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow">
          <p class="text-2xl font-bold text-blue-600">{{ stats.totalOrders }}</p>
          <p class="text-sm text-gray-600">Orders</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow">
          <p class="text-2xl font-bold text-green-600">{{ stats.totalRevenue }}</p>
          <p class="text-sm text-gray-600">Revenue</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow">
          <p class="text-2xl font-bold text-yellow-600">{{ stats.pendingOrders }}</p>
          <p class="text-sm text-gray-600">Pending Orders</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow">
        <div class="p-6 border-b">
          <h2 class="font-poppins font-bold text-lg text-gray-800">Recent Orders</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Order ID</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Customer</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="py-3 px-4 text-sm">#{{ order.id }}</td>
                <td class="py-3 px-4 text-sm">{{ order.delivery_address?.split(',')[0] || 'N/A' }}</td>
                <td class="py-3 px-4 text-sm">{{ formatCurrency(order.total) }}</td>
                <td class="py-3 px-4">
                  <span class="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">{{ order.status }}</span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-600">{{ formatDate(order.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '../stores/products'
import { useUiStore } from '../stores/ui'
import orderService from '../services/orderService'
import { formatCurrency } from '../utils'
import AdminSidebar from '../components/admin/AdminSidebar.vue'

const productStore = useProductStore()
const uiStore = useUiStore()

const { products: allProducts } = storeToRefs(productStore)

const orders = ref([])
const loading = ref(false)

const stats = computed(() => ({
  totalProducts: allProducts.value.length,
  totalOrders: orders.value.length,
  totalRevenue: orders.value.reduce((sum, o) => sum + (o.total || 0), 0),
  pendingOrders: orders.value.filter((o) => o.status === 'pending').length,
}))

const recentOrders = computed(() => {
  return [...orders.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const { data, error } = await orderService.getAllOrders()
    if (error) throw error
    orders.value = data || []
  } catch (e) {
    uiStore.addToast('Failed to load orders', 'error')
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  if (!allProducts.value.length) {
    await productStore.fetchProducts()
  }
}

onMounted(async () => {
  await Promise.all([fetchOrders(), fetchProducts()])
})
</script>
