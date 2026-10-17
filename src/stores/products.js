import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import productService from '../services/productService'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const featured = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedCategory = ref(null)
  const sortBy = ref('')

  const filteredProducts = computed(() => {
    let result = [...products.value]

    if (selectedCategory.value) {
      result = result.filter((p) => p.category_id === selectedCategory.value)
    }

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }

    if (sortBy.value === 'price_asc') result.sort((a, b) => a.price - b.price)
    else if (sortBy.value === 'price_desc') result.sort((a, b) => b.price - a.price)
    else if (sortBy.value === 'name') result.sort((a, b) => a.name.localeCompare(b.name))

    return result
  })

  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await productService.getCategories()
      if (err) throw err
      categories.value = data || []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await productService.getProducts()
      if (err) throw err
      products.value = data || []
      featured.value = (data || []).slice(0, 4)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await productService.getProduct(id)
      if (err) throw err
      return data
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  function setCategory(categoryId) {
    selectedCategory.value = categoryId
  }

  function clearFilters() {
    selectedCategory.value = null
    searchQuery.value = ''
    sortBy.value = ''
  }

  return {
    products,
    categories,
    featured,
    loading,
    error,
    searchQuery,
    selectedCategory,
    sortBy,
    filteredProducts,
    fetchCategories,
    fetchProducts,
    fetchProduct,
    setCategory,
    clearFilters
  }
})