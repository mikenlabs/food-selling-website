import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isBrowser } from '../utils'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isOpen = ref(false)

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

  function loadCart() {
    if (!isBrowser()) return
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        items.value = JSON.parse(saved)
      } catch (e) {
        items.value = []
      }
    }
  }

  function saveCart() {
    if (isBrowser()) {
      localStorage.setItem('cart', JSON.stringify(items.value))
    }
  }

  function addItem(product, quantity = 1) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity,
      })
    }
    saveCart()
  }

  function removeItem(id) {
    items.value = items.value.filter((i) => i.id !== id)
    saveCart()
  }

  function updateQuantity(id, quantity) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      if (quantity <= 0) {
        removeItem(id)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  function clearCart() {
    items.value = []
    saveCart()
  }

  function toggleCart() {
    isOpen.value = !isOpen.value
  }

  function closeCart() {
    isOpen.value = false
  }

  function openCart() {
    isOpen.value = true
  }

  return {
    items, isOpen, count, subtotal,
    loadCart, addItem, removeItem, updateQuantity, clearCart,
    toggleCart, closeCart, openCart
  }
})