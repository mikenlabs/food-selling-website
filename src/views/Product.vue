<template>
  <div v-if="loading" class="grid md:grid-cols-2 gap-8">
    <div class="animate-pulse bg-gray-200 rounded-xl aspect-square"></div>
    <div class="space-y-4">
      <div class="h-8 bg-gray-200 rounded w-3/4"></div>
      <div class="h-6 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-10 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>

  <div v-else-if="product" class="grid md:grid-cols-2 gap-8">
    <ProductGallery :product="product" />

    <div class="space-y-4">
      <div>
        <h1 class="font-poppins font-bold text-3xl text-gray-800 mb-2">{{ product.name }}</h1>
        <div class="flex items-center gap-2 mb-2">
          <span class="font-bold text-2xl text-primary-600">{{ formatCurrency(product.price) }}</span>
          <span
            class="text-xs px-2 py-1 rounded-full"
            :class="product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ product.is_available && product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock' }}
          </span>
        </div>
      </div>

      <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>

      <div class="pt-4 border-t">
        <QuantitySelector
          v-model="quantity"
          :max-stock="product.stock"
        />
      </div>

      <button
        @click="addToCart"
        :disabled="!product.is_available || product.stock === 0"
        class="btn btn-primary w-full py-3 text-lg disabled:opacity-50"
      >
        {{ product.is_available ? 'Add to Cart' : 'Currently Unavailable' }}
      </button>
    </div>
  </div>

  <EmptyState v-else title="Product not found" message="The product you're looking for doesn't exist." />

  <section v-if="product && relatedProducts.length" class="mt-12">
    <h2 class="font-poppins font-bold text-2xl text-gray-800 mb-6">You May Also Like</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <ProductCard
        v-for="related in relatedProducts"
        :key="related.id"
        :product="related"
        :small="true"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import productService from '../services/productService'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useUiStore } from '../stores/ui'
import { formatCurrency } from '../utils'
import ProductGallery from '../components/product/ProductGallery.vue'
import ProductCard from '../components/product/ProductCard.vue'
import QuantitySelector from '../components/cart/QuantitySelector.vue'
import EmptyState from '../components/ui/EmptyState.vue'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
const uiStore = useUiStore()

const { loading } = storeToRefs(productStore)

const product = ref(null)
const relatedProducts = ref([])
const quantity = ref(1)

const fetchProduct = async () => {
  const id = route.params.id
  product.value = await productStore.fetchProduct(id)
  if (product.value) {
    const { data } = await productService.getRelatedProducts(product.value.category_id, product.value.id)
    relatedProducts.value = data || []
  }
}

const addToCart = () => {
  if (!product.value?.is_available) return
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem(product.value)
  }
  uiStore.addToast(`${quantity.value} item(s) added to cart`, 'success')
  quantity.value = 1
}

onMounted(() => {
  fetchProduct()
})
</script>
