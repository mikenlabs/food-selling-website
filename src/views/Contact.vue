<template>
  <div class="mb-8">
    <section class="text-center mb-12">
      <h1 class="font-poppins font-bold text-3xl text-gray-800 mb-4">Contact Us</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">Have a question or want to place an order? Get in touch with us!</p>
    </section>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Contact Info -->
      <div class="space-y-6">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 18a2 2 0 01-1.414-.586l-4.082-4.082a2 2 0 01-.586-1.414V4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-.586 1.414l-4.082 4.082a2 2 0 01-1.414.586h-2.082"/>
            </svg>
          </div>
          <div>
            <h3 class="font-poppins font-semibold text-gray-800">Phone</h3>
            <p class="text-gray-600">+234 800 FOOD DELIVERY</p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-poppins font-semibold text-gray-800">Email</h3>
            <p class="text-gray-600">info@chisomskitchen.com</p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 18a2 2 0 01-1.414-.586l-4.082-4.082a2 2 0 01-.586-1.414V4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-.586 1.414l-4.082 4.082a2 2 0 01-1.414.586h-2.082"/>
            </svg>
          </div>
          <div>
            <h3 class="font-poppins font-semibold text-gray-800">Address</h3>
            <p class="text-gray-600">123 Food Street, Victoria Island, Lagos, Nigeria</p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"/>
              <circle cx="12" cy="12" r="9" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <h3 class="font-poppins font-semibold text-gray-800">Working Hours</h3>
            <p class="text-gray-600">Mon-Fri: 8AM - 10PM <br>Sat-Sun: 10AM - 11PM</p>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <form @submit.prevent="sendMessage" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <input v-model="form.name" type="text" placeholder="Your Name" class="input-field" required />
          <input v-model="form.email" type="email" placeholder="Your Email" class="input-field" required />
        </div>
        <input v-model="form.subject" type="text" placeholder="Subject" class="input-field" required />
        <textarea v-model="form.message" rows="5" placeholder="Your Message" class="input-field" required></textarea>
        <button type="submit" :disabled="loading" class="btn btn-primary w-full">
          <span v-if="loading">Sending...</span>
          <span v-else>Send Message</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUiStore } from '../stores/ui'

const uiStore = useUiStore()

const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const sendMessage = async () => {
  loading.value = true
  try {
    // In a real app, this would call an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000))
    uiStore.addToast('Message sent successfully! We will reply shortly.', 'success')
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch (e) {
    uiStore.addToast('Failed to send message', 'error')
  } finally {
    loading.value = false
  }
}
</script>
