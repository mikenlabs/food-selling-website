<template>
  <div class="min-h-screen flex items-center justify-center py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11.701a9 9 0 1117.89.299 9 9 0 01-17.89.299z"/>
            </svg>
          </div>
          <span class="font-poppins font-bold text-2xl text-primary-600 ms-3">Chisom's Kitchen</span>
        </div>
        <h1 class="font-poppins font-bold text-2xl text-gray-800">Welcome Back</h1>
        <p class="text-gray-600 mt-1">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" class="input-field" placeholder="you@example.com" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input-field"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.878 15.121A5.25 5.25 0 0112 15.75c-2.071 0-3.856-.956-4.974-2.466-.073-.094.069-.26.069-.26l.04-.115a1.25 1.25 0 011.745-.795.75.75 0 01.352 1.052 3.75 3.75 0 005.018 1.785 3.75 3.75 0 001.784-.795.75.75 0 011.05 0 .75.75 0 010 1.05z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.036 12C3.254 7.183 7.71 3.75 12 3.75c4.273 0 8.727 3.432 9.964 8.25-.056.3-.117.596-.184.89-.067.294-.467.416-.729.275A8.25 8.25 0 0012 6.75c-1.315 0-2.547.313-3.583.838-.075.045-.13.13-.08.218a.3.3 0 00.04.054.75.75 0 01-1.056 1.062 9.998 9.998 0 00-5.343 4.845.188.188 0 00.192.136z"/>
              </svg>
            </button>
          </div>
        </div>
        <button type="submit" :disabled="loading" class="btn btn-primary w-full">
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-6">
        Don't have an account?
        <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-medium">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()

const { loading, isAuthenticated } = authStore
const showPassword = ref(false)

const form = ref({
  email: '',
  password: '',
})

const handleLogin = async () => {
  const { success, error } = await authStore.login(form.value.email, form.value.password)
  if (success) {
    uiStore.addToast('Logged in successfully', 'success')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    uiStore.addToast('Login failed: ' + error, 'error')
  }
}
</script>
