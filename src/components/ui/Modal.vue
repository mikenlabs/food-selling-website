<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <transition name="modal-content">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative">
            <button @click="close" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <h3 class="font-poppins font-bold text-lg mb-4">{{ title }}</h3>
            <p class="text-sm text-gray-600 mb-6">{{ message }}</p>
            <div class="flex gap-3">
              <button @click="confirm" class="btn btn-primary flex-1">{{ confirmText }}</button>
              <button @click="close" class="btn btn-outline flex-1">{{ cancelText }}</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' }
})

const emit = defineEmits(['close', 'confirm'])

function close() {
  emit('close')
}

function confirm() {
  emit('confirm')
  emit('close')
}
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-content-enter-active {
  transition: all 0.3s ease;
}
.modal-content-enter-from {
  opacity: 0;
  scale: 0.9;
}
.modal-content-leave-to {
  opacity: 0;
  scale: 0.9;
}
</style>