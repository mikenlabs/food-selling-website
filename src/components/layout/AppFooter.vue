<template>
  <footer class="bg-gray-900 text-gray-200">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11.701a9 9 0 1117.89.299 9 9 0 01-17.89.299z"/>
              </svg>
            </div>
            <span class="font-poppins font-bold text-xl text-white">Chisom's Kitchen</span>
          </div>
          <p class="text-sm text-gray-400">Fresh, authentic Nigerian meals delivered to your door.</p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-poppins font-semibold text-white mb-4">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/" class="hover:text-primary-400 transition-colors">Home</router-link></li>
            <li><router-link to="/shop" class="hover:text-primary-400 transition-colors">Shop</router-link></li>
            <li><router-link to="/about" class="hover:text-primary-400 transition-colors">About</router-link></li>
            <li><router-link to="/contact" class="hover:text-primary-400 transition-colors">Contact</router-link></li>
            <li><router-link to="/my-orders" class="hover:text-primary-400 transition-colors">My Orders</router-link></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="font-poppins font-semibold text-white mb-4">Contact Info</h3>
          <ul class="space-y-2 text-sm">
            <li>Lagos, Nigeria</li>
            <li>info@chisomskitchen.com</li>
            <li>+234 800 FOOD DELIVERY</li>
            <li class="mt-2">Mon-Fri: 8AM - 10PM</li>
          </ul>
        </div>

        <!-- Social Icons -->
        <div>
          <h3 class="font-poppins font-semibold text-white mb-4">Follow Us</h3>
          <div class="flex space-x-4">
            <a href="#" class="p-2 rounded-full bg-gray-800 hover:bg-primary-600 transition-colors" aria-label="Facebook">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.526v20.948C0 23.4.6 24 1.526 24h11.318v-9.294H9.692V11.01h3.15V8.413c0-3.1 1.894-4.788 4.66-4.788 1.34 0 2.48.992 2.48 2.178v3.24l-2.084.001c-1.344 0-1.612.629-1.612 1.553v2.04h3.587l-.467 3.692h-3.048V24h5.926c.826 0 1.46-1.088 1.46-1.926V1.526C24 .6 23.371 0 22.675 0z"/></svg>
            </a>
            <a href="#" class="p-2 rounded-full bg-gray-800 hover:bg-primary-600 transition-colors" aria-label="Instagram">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.584.01 4.85.07 1.17.055 1.804.24 2.247.404.568.227.987.517 1.407.937.419.42.71 1.04.937 1.608.165.442.354 1.076.41 2.245.06 1.267.07 1.647.07 4.856s-.01 3.584-.066 4.85c-.057 1.17-.246 1.804-.41 2.247-.227.568-.517.987-.937 1.407-.42.419-1.04.71-1.608.937-.442.165-1.076.354-2.245.41-1.267.06-1.647.067-4.856.067s-3.584-.007-4.85-.066c-1.17-.057-1.804-.246-2.247-.41-.568-.227-.987-.517-1.407-.937-.419-.42-.71-1.04-.937-1.608-.165-.442-.354-1.076-.41-2.245-.06-1.267-.07-1.647-.07-4.856s.01-3.584.066-4.85c.057-1.17.246-1.804.41-2.247.227-.568.517-.987.937-1.407.42-.419 1.04-.71 1.608-.937.442-.165 1.076-.354 2.245-.41 1.267-.06 1.647-.066 4.85-.066M12 0C8.74 0 8.333.015 9.62.083 10.827.14 11.574.32 12.445.66c.657.26 1.16.56 1.622.795.338.184.738.398 1.206.866.468.468.682.868.866 1.206.24.463.435 1.012.515 1.675.072 1.16.083 1.57.083 4.828s-.011 3.668-.083 4.828c-.08.663-.275 1.212-.515 1.675-.184.338-.398.738-.866 1.206-.468.468-.868.682-1.206.866-.463.24-1.012.434-1.675.514-1.16.072-1.57.082-4.828.082s-3.668-.01-4.828-.082c-.663-.08-1.212-.27-1.675-.51-3.301-1.437-3.301-1.437-3.301-3.13v-2.448c0-1.693 0-1.693 0-2.296C.081 9.612 0 8.173 0 8.173c0-.657.015-2.097.083-3.257.08-1.16.27-1.814.515-2.276.184-.338.398-.738.866-1.206.468-.468.868-.682 1.206-.795.463-.17.972-.35 1.675-.424 1.167-.06 1.576-.07 4.834-.07z"/></svg>
            </a>
            <a href="#" class="p-2 rounded-full bg-gray-800 hover:bg-primary-600 transition-colors" aria-label="Twitter">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.954 4.569c-.885.389-1.83.653-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.128 1.184-.896-.959-2.173-1.559-3.591-1.559-2.718 0-4.925 2.209-4.925 4.928 0 .389.045.766.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.721-.666 1.565-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.123-2.228-.317v.062c0 2.386 1.695 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.617-.031-.916-.086.631 1.951 2.445 3.377 4.604 3.417-1.68 1.318-3.809 2.105-6.102 2.105-.36 0-.71-.021-1.05-.062 2.188 1.397 4.768 2.212 7.557 2.212 9.054 0 13.833-7.496 13.833-13.986 0-.23 0-.461-.016-.69C22.365 6.576 23.954 5.576 23.954 4.569z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
        <p>&copy; 2024 Chisom's Kitchen. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
