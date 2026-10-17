<template>
  <div class="flex items-center gap-2">
    <button
      @click="decrement"
      :disabled="modelValue <= 1 || disabled"
      class="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm font-bold"
    >
      -
    </button>
    <input
      type="number"
      :value="modelValue"
      min="1"
      :max="maxStock"
      class="w-12 text-center text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
      @input="emit('update:modelValue', parseInt($event.target.value, 10) || 1)"
    />
    <button
      @click="increment"
      :disabled="modelValue >= maxStock || disabled"
      class="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm font-bold"
    >
      +
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 1 },
  maxStock: { type: Number, default: 99 },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const decrement = () => {
  if (props.modelValue > 1 && !props.disabled) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

const increment = () => {
  if (props.modelValue < props.maxStock && !props.disabled) {
    emit('update:modelValue', props.modelValue + 1)
  }
}
</script>
