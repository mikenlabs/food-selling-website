<template>
  <div class="mb-8">
    <h1 class="font-poppins font-bold text-2xl text-gray-800 mb-6">Your Shopping Cart</h1>

    <div v-if="!cartItems.length" class="text-center py-12">
      <svg class="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.89 2.72M7 13h10l-.89-2.72M7 13L5.11 10.28M7 13l-2 4v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2H7z"/>
      </svg>
      <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
      <router-link to="/shop" class="btn btn-primary">Continue Shopping</router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="flex items-center gap-4 p-4 border rounded-xl"
      >
        <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img :src="item.image_url" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="flex-1">
          <h4 class="font-poppins font-semibold text-gray-800">{{ item.name }}</h4>
          <p class="text-gray-600 text-sm mt-1">{{ formatCurrency(item.price) }} x {{ item.quantity }}</p>
        </div>
        <QuantitySelector
          v-model="item.quantity"
          :max-stock="99"
        />
        <span class="font-semibold">{{ formatCurrency(item.price * item.quantity) }}</span>
        <button
          @click="removeItem(item.id)"
          class="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.133A2 2 0 0116.133 21H7.867a2 2 0 01-1.995-1.867L5 7M9 2v6m6-6v6M4 7h16M4 7l1-4h14l1 4M4 7h16"/>
          </svg>
        </button>
      </div>

      <div class="border-t pt-6 space-y-3">
        <div class="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{{ formatCurrency(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span>{{ deliveryFee > 0 ? formatCurrency(deliveryFee) : 'FREE' }}</span>
        </div>
        <div class="flex justify-between font-bold text-xl pt-3 border-t">
          <span>Total</span>
          <span class="text-primary-600">{{ formatCurrency(total) }}</span>
        </div>
      </div>

      <div class="flex gap-4 pt-6">
        <router-link to="/shop" class="btn btn-outline">Continue Shopping</router-link>
        <router-link to="/checkout" class="btn btn-primary flex-1 justify-center">Proceed to Checkout</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '../stores/cart'
import { formatCurrency } from '../utils'
import QuantitySelector from '../components/cart/QuantitySelector.vue'

const cartStore = useCartStore()
const { items: cartItems, subtotal } = storeToRefs(cartStore)

const deliveryFee = computed(() => subtotal.value >= 5000 ? 0 : 1000)
const total = computed(() => subtotal.value + deliveryFee.value)

const removeItem = (id) => cartStore.removeItem(id)

const updateCartQuantity = () => {
  cartStore.saveCart()
}

watch(cartItems, updateCartQuantity, { deep: true })
</script>
