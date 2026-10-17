<template>
  <div class="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
    <button
      v-for="category in categories"
      :key="category.id"
      @click="selectCategory(category.id)"
      :class="selectedCategory === category.id ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border border-gray-200'"
      class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
    >
      {{ category.name }}
    </button>
    <button
      @click="selectCategory(null)"
      :class="!selectedCategory ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border border-gray-200'"
      class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
    >
      All
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: { type: Array, default: () => [] },
  selectedCategory: { type: String, default: null }
})

const emit = defineEmits(['select'])

function selectCategory(id) {
  emit('select', id)
}
</script>