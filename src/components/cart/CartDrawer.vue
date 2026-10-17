<template>
  <teleport to="body">
    <transition name="slide">
      <div v-if="isVisible" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/50" @click="closeDrawer"></div>
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <h2 class="font-poppins font-bold text-xl">Your Cart ({{ cartCount }})</h2>
              <button @click="closeDrawer" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div v-if="cartItems.length === 0" class="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.89 2.72M7 13h10l-.89-2.72M7 13L5.11 10.28M7 13l-2 4v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2H7z"/>
              </svg>
              <p class="text-gray-500">Your cart is empty</p>
            </div>
            <div v-else class="space-y-4">
              <CartItem
                v-for="item in cartItems"
                :key="item.id"
                :item="item"
                @remove="removeItem(item.id)"
              />
            </div>
          </div>

          <div v-if="cartItems.length > 0" class="p-6 border-t">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Subtotal</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Delivery Fee</span>
              <span>{{ deliveryFee > 0 ? formatCurrency(deliveryFee) : 'FREE' }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span class="text-primary-600">{{ formatCurrency(total) }}</span>
            </div>
            <router-link to="/checkout" @click="closeDrawer" class="btn btn-primary w-full">
              Proceed to Checkout
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cart'
import { formatCurrency } from '../../utils'
import CartItem from './CartItem.vue'

const props = defineProps({
  isVisible: { type: Boolean, required: true }
})

const emit = defineEmits(['close'])

const router = useRouter()
const cartStore = useCartStore()

const { items: cartItems, subtotal } = storeToRefs(cartStore)

const deliveryFee = computed(() => subtotal.value >= 5000 ? 0 : 1000)
const total = computed(() => subtotal.value + deliveryFee.value)
const cartCount = computed(() => cartStore.count)

function closeDrawer() {
  emit('close')
}

function removeItem(id) {
  cartStore.removeItem(id)
}
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>