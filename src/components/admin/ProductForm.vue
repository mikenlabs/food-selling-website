<template>
  <div class="bg-white rounded-2xl shadow-md p-6">
    <h2 class="font-poppins font-bold text-xl mb-4">{{ isEdit ? 'Edit Product' : 'Add Product' }}</h2>

    <form @submit.prevent="save" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="input-field w-full"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="input-field w-full"
          required
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
          <input
            v-model.number="form.price"
            type="number"
            class="input-field w-full"
            min="0"
            step="100"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            v-model.number="form.stock"
            type="number"
            class="input-field w-full"
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select v-model="form.category_id" class="input-field w-full" required>
          <option value="" disabled>Select a category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          v-model="form.image_url"
          type="url"
          class="input-field w-full"
          placeholder="https://..."
        />
        <div v-if="form.image_url" class="mt-2">
          <img :src="form.image_url" alt="Preview" class="w-20 h-20 object-cover rounded-lg" />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input type="checkbox" id="isAvailable" v-model="form.is_available" />
        <label for="isAvailable" class="text-sm text-gray-700">Available for purchase</label>
      </div>

      <div class="flex gap-3 pt-4">
        <button type="submit" class="btn btn-primary flex-1">{{ isEdit ? 'Update' : 'Save' }}</button>
        <button type="button" @click="reset" class="btn btn-outline flex-1">Reset</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '../../stores/products'
import { useUiStore } from '../../stores/ui'

const props = defineProps({
  product: { type: Object, default: null }
})

const emit = defineEmits(['saved'])

const productStore = useProductStore()
const uiStore = useUiStore()

const { categories } = storeToRefs(productStore)

const isEdit = ref(!!props.product)
const form = ref({
  name: '',
  description: '',
  price: 0,
  image_url: '',
  category_id: '',
  stock: 0,
  is_available: true,
})

const reset = () => {
  form.value = {
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category_id: '',
    stock: 0,
    is_available: true,
  }
}

watch(() => props.product, (val) => {
  if (val) {
    isEdit.value = true
    form.value = { ...val }
  }
}, { immediate: true })

const save = () => {
  emit('saved', { ...form.value })
}
</script>