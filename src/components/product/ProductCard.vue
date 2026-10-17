<template>
  <div class="bg-white rounded-2xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-lg">
    <div class="aspect-square overflow-hidden bg-gray-100">
      <img
        :src="product.image_url"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-poppins font-semibold text-lg text-gray-800 line-clamp-1">{{ product.name }}</h3>
        <span
          class="text-xs px-2 py-1 rounded-full"
          :class="product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          {{ product.is_available ? 'In Stock' : 'Out of Stock' }}
        </span>
      </div>
      <p class="text-gray-600 text-sm line-clamp-2 mb-3">{{ product.description }}</p>
      <div class="flex items-center justify-between mb-3">
        <span class="font-bold text-xl text-primary-600">{{ formatCurrency(product.price) }}</span>
      </div>
      <button
        @click="addToCart"
        :disabled="!product.is_available || product.stock === 0"
        class="w-full btn btn-primary text-sm py-1.5 disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '../../utils'
import { useCartStore } from '../../stores/cart'
import { useUiStore } from '../../stores/ui'

const props = defineProps({
  product: { type: Object, required: true }
})

const cartStore = useCartStore()
const uiStore = useUiStore()

function addToCart() {
  cartStore.addItem(props.product)
  uiStore.addToast('Item added to cart', 'success')
}
</script>
