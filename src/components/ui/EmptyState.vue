<template>
  <div class="text-center py-12">
    <div class="text-gray-400 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h8m-9-4l3-3m0 0l3 3m-3-3v8"/>
      </svg>
    </div>
    <h3 class="text-lg font-poppins font-semibold text-gray-800 mb-2">{{ title }}</h3>
    <p class="text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'No results found' },
  message: { type: String, default: 'We couldn\'t find anything matching your search.' }
})
</script>