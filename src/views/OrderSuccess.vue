<template>
  <div class="min-h-screen flex items-center justify-center py-12">
    <div class="text-center max-w-md">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h1 class="font-poppins font-bold text-2xl text-gray-800 mb-4">Order Confirmed!</h1>
      <p class="text-gray-600 mb-6">
        Your order <strong class="text-primary-600">#{{ orderId }}</strong> has been placed successfully.
      </p>
      <p class="text-sm text-gray-500 mb-8">
        We'll contact you shortly to confirm your delivery. You can track your order status in My Orders.
      </p>
      <div class="flex gap-4 justify-center">
        <router-link to="/my-orders" class="btn btn-outline">View My Orders</router-link>
        <router-link to="/" class="btn btn-primary">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = route.params.id || 'ORD0000'
</script>
