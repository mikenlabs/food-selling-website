<template>
  <div class="space-y-4">
    <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
      <img
        :src="mainImage || product.image_url"
        :alt="product.name"
        class="w-full h-full object-cover object-center transition-transform duration-300"
      />
    </div>

    <div v-if="thumbnails.length > 0" class="grid grid-cols-5 gap-2">
      <button
        v-for="(thumb, i) in thumbnails"
        :key="i"
        @click="mainImage = thumb"
        class="aspect-square rounded-lg overflow-hidden border-2 transition-all"
        :class="mainImage === thumb ? 'border-primary-500' : 'border-gray-200'"
      >
        <img :src="thumb" :alt="product.name" class="w-full h-full object-cover" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const mainImage = ref(props.product?.image_url || '')

const thumbnails = computed(() => {
  if (!props.product) return []
  return [props.product.image_url]
})
</script>