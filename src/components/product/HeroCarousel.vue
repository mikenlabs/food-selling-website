<template>
  <div class="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden mb-6">
    <div
      v-for="(slide, index) in slides"
      :key="slide.id"
      class="absolute inset-0 transition-opacity duration-500"
      :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
    >
      <div class="absolute inset-0 bg-gradient-to-r from-primary-700/80 to-primary-500/60 z-[1]"></div>
      <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" loading="lazy" />
      <div class="relative z-[2] container mx-auto px-4 h-full flex items-center">
        <div class="text-white max-w-md">
          <h2 class="font-poppins font-bold text-2xl sm:text-3xl mb-2">{{ slide.title }}</h2>
          <p class="text-sm opacity-90 mb-4">{{ slide.subtitle }}</p>
          <router-link :to="slide.link" class="btn btn-outline">Order Now</router-link>
        </div>
      </div>
    </div>

    <button @click="prevSlide" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>
    <button @click="nextSlide" class="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>

    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
      <button
        v-for="(_, i) in slides"
        :key="i"
        @click="currentSlide = i"
        class="w-2 h-2 rounded-full transition-colors"
        :class="{ 'bg-white': currentSlide === i, 'bg-white/40': currentSlide !== i }"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  {
    id: 1,
    title: 'Authentic Nigerian Flavours',
    subtitle: 'Freshly prepared meals delivered to your doorstep every day.',
    image: 'https://picsum.photos/seed/jollof/800/800',
    link: '/shop',
  },
  {
    id: 2,
    title: 'Weekend Special',
    subtitle: 'Get 15% off on all local delicacies this weekend only!',
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800',
    link: '/shop',
  },
  {
    id: 3,
    title: 'Free Delivery',
    subtitle: 'On orders above ₦5,000. Order now and enjoy!',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    link: '/shop',
  },
]

const currentSlide = ref(0)
let autoPlay = null

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

onMounted(() => {
  autoPlay = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (autoPlay) clearInterval(autoPlay)
})
</script>