<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    <div v-for="i in count" :key="i" class="animate-pulse">
      <div class="bg-gray-200 rounded-xl aspect-square mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 4 }
})
</script>