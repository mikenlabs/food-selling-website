<template>
  <div class="flex items-center gap-4">
    <div class="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
      <img :src="item.image_url" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
    </div>
    <div class="flex-1">
      <h4 class="font-poppins font-semibold text-gray-800">{{ item.name }}</h4>
      <p class="text-gray-600 text-sm mt-1">{{ formatCurrency(item.price) }} x {{ item.quantity }}</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="font-semibold">{{ formatCurrency(item.price * item.quantity) }}</span>
      <button @click="$emit('remove')" class="text-red-500 hover:text-red-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.133A2 2 0 0116.133 21H7.867a2 2 0 01-1.995-1.867L5 7M9 2v6m6-6v6M4 7h16M4 7l1-4h14l1 4M4 7h16"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
})

defineEmits(['remove'])

import { formatCurrency } from '../../utils'
</script>