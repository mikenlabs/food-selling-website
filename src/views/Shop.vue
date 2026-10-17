<template>
  <div class="mb-8">
    <!-- Search and Filters -->
    <div class="mb-6">
      <div class="relative mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for food..."
          class="input-field pl-10"
        />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      <CategoryChips
        :categories="categories"
        :selected-category="selectedCategory"
        @select="setCategory"
      />
    </div>

    <!-- Sort Controls -->
    <div class="flex items-center justify-between mb-6">
      <div class="text-sm text-gray-600">
        {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'item' : 'items' }} found
      </div>
      <select v-model="sortBy" class="input-field text-sm w-auto">
        <option value="">Sort by</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name">Name: A-Z</option>
      </select>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <LoadingSkeleton v-for="i in 8" :key="i" />
    </div>

    <EmptyState v-else-if="filteredProducts.length === 0" />

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '../stores/products'
import CategoryChips from '../components/ui/CategoryChips.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ProductCard from '../components/product/ProductCard.vue'

const productStore = useProductStore()
const { products, categories, loading, selectedCategory, searchQuery, sortBy, filteredProducts } = storeToRefs(productStore)

onMounted(() => {
  if (!products.value.length) {
    productStore.fetchProducts()
  }
  if (!categories.value.length) {
    productStore.fetchCategories()
  }
})

const setCategory = (id) => productStore.setCategory(id)
</script>
