<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo + Brand -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11.701a9 9 0 1117.89.299 9 9 0 01-17.89.299z"/>
            </svg>
          </div>
          <span class="font-poppins font-bold text-xl text-primary-600">Chisom's Kitchen</span>
        </router-link>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="hover:text-primary-600 transition-colors">Home</router-link>
          <router-link to="/shop" class="hover:text-primary-600 transition-colors">Shop</router-link>
          <router-link to="/about" class="hover:text-primary-600 transition-colors">About</router-link>
          <router-link to="/contact" class="hover:text-primary-600 transition-colors">Contact</router-link>
          <router-link v-if="!isAuthenticated" to="/login" class="hover:text-primary-600 transition-colors">Login</router-link>
          <button v-if="isAuthenticated" @click="logout" class="hover:text-primary-600 transition-colors">Logout</button>
        </nav>

        <!-- Icons -->
        <div class="flex items-center space-x-3">
          <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          <button @click="openCart" class="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.89 2.72M7 13h10l-.89-2.72M7 13L5.11 10.28M7 13l-2 4v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2H7z"/>
            </svg>
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{{ cartCount }}</span>
          </button>

          <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
        <nav v-if="isMobileMenuOpen" class="md:hidden mt-3 pb-3 border-t border-gray-200">
          <router-link to="/" @click="closeMobileMenu" class="block py-2 hover:text-primary-600 transition-colors">Home</router-link>
          <router-link to="/shop" @click="closeMobileMenu" class="block py-2 hover:text-primary-600 transition-colors">Shop</router-link>
          <router-link to="/about" @click="closeMobileMenu" class="block py-2 hover:text-primary-600 transition-colors">About</router-link>
          <router-link to="/contact" @click="closeMobileMenu" class="block py-2 hover:text-primary-600 transition-colors">Contact</router-link>
          <router-link v-if="!isAuthenticated" to="/login" @click="closeMobileMenu" class="block py-2 hover:text-primary-600 transition-colors">Login</router-link>
          <button v-if="isAuthenticated" @click="logout; closeMobileMenu()" class="block w-full text-left py-2 hover:text-primary-600 transition-colors">Logout</button>
        </nav>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useUiStore } from '../../stores/ui'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const uiStore = useUiStore()
const router = useRouter()

const { isAuthenticated } = storeToRefs(authStore)
const { count: cartCount } = storeToRefs(cartStore)
const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = uiStore

const openCart = () => cartStore.openCart()

const logout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>