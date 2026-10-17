<template>
  <div id="app" class="min-h-screen flex flex-col">
    <AppHeader />
    <CartDrawer :is-visible="cartDrawerOpen" @close="cartStore.closeCart" />
    <main class="flex-1 container mx-auto px-4 py-6">
      <router-view />
    </main>
    <AppFooter />
    <ToastHost />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import CartDrawer from './components/cart/CartDrawer.vue'
import ToastHost from './components/ui/ToastHost.vue'
import { useCartStore } from './stores/cart'

const cartStore = useCartStore()
const { isOpen: cartDrawerOpen } = storeToRefs(cartStore)
</script>
