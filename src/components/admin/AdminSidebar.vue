<template>
  <aside class="w-64 bg-white shadow-md overflow-y-auto">
    <div class="p-4 border-b">
      <span class="font-poppins font-bold text-xl text-primary-600">Admin Panel</span>
    </div>
      <div class="p-2">
        <button
          v-for="item in menuItems"
          :key="item.path"
          @click="goTo(item.path)"
          :class="currentPath === item.path ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
          class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath" />
          </svg>
          {{ item.name }}
        </button>
      </div>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const currentPath = computed(() => route.path)

const menuItems = [
  { name: 'Dashboard', path: '/admin', iconPath: 'M3 12l9-9 9 9h-3v9h-4v-5H12v5H8v-9H3' },
  { name: 'Products', path: '/admin/products', iconPath: 'M4 7l16 0v2l-4 2-4 2-4-2L4 9V7z M12 11v10' },
  { name: 'Categories', path: '/admin/categories', iconPath: 'M3 7v2l8 2 8-2V7l-2-2h-4L9 5H7L5 7zM7 11l-4 2v4l4 2 4 2' },
  { name: 'Orders', path: '/admin/orders', iconPath: 'M9 5l.001 4 2-2 2 2 .001-4M5 9h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9z' },
]

function goTo(path) {
  router.push(path)
}
</script>