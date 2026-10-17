<template>
  <div>
    <!-- Hero Carousel -->
    <section class="mb-8">
      <HeroCarousel />
    </section>

    <!-- Featured Products -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-poppins font-bold text-2xl text-gray-800">Featured Products</h2>
        <router-link to="/shop" class="text-primary-600 hover:text-primary-700 font-medium text-sm">View all</router-link>
      </div>

      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <LoadingSkeleton v-for="i in 4" :key="i" />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">Error loading products: {{ error }}</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </section>

    <!-- Promo Banner -->
    <section class="mb-8">
      <PromoBanner
        title="Free Delivery on Orders Above ₦5,000"
        subtitle="Enjoy fast and free delivery when you order over five thousand naira. Order now!"
        link="/shop"
      />
    </section>

    <!-- Local Delicacies -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-poppins font-bold text-2xl text-gray-800">Local Delicacies</h2>
        <router-link to="/shop" class="text-primary-600 hover:text-primary-700 font-medium text-sm">View all</router-link>
      </div>

      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <LoadingSkeleton v-for="i in 4" :key="i" />
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in localDelicacies"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '../stores/products'
import HeroCarousel from '../components/product/HeroCarousel.vue'
import ProductCard from '../components/product/ProductCard.vue'
import PromoBanner from '../components/product/PromoBanner.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'

const productStore = useProductStore()
const { products, loading, error } = storeToRefs(productStore)

const localDelicacies = computed(() => {
  return products.value.filter((p) => p.category_id === 'cat5').slice(0, 4)
})

onMounted(() => {
  if (!products.value.length) {
    productStore.fetchProducts()
  }
})
</script>