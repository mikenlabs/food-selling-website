<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2 w-full max-w-sm">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="p-4 rounded-xl shadow-lg flex items-start gap-3 text-sm"
        :class="toastClasses(toast.type)"
      >
        <div class="flex-1">{{ toast.message }}</div>
        <button @click="removeToast(toast.id)" class="ml-2 text-current opacity-70 hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUiStore } from '../../stores/ui'

const uiStore = useUiStore()
const { toasts } = storeToRefs(uiStore)
const { removeToast } = uiStore

function toastClasses(type) {
  if (type === 'success') return 'bg-white border border-green-500 text-gray-800'
  if (type === 'error') return 'bg-white border border-red-500 text-gray-800'
  if (type === 'warning') return 'bg-white border border-yellow-500 text-gray-800'
  return 'bg-white border border-gray-300 text-gray-800'
}
</script>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
