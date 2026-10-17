<template>
  <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl overflow-hidden mb-6 relative">
    <div class="absolute inset-0 bg-black/10"></div>
    <div class="container mx-auto px-4 py-8 text-center text-white relative z-10">
      <h3 class="font-poppins font-bold text-xl sm:text-2xl mb-2">{{ title }}</h3>
      <p class="text-sm opacity-90 mb-4">{{ subtitle }}</p>
      <router-link :to="link" class="btn btn-outline">Order Now</router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Free Delivery on Orders Above ₦5,000' },
  subtitle: { type: String, default: 'Enjoy fast and free delivery when you order over five thousand naira' },
  link: { type: String, default: '/shop' }
})
</script>