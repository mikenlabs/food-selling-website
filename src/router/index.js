import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import Product from '../views/Product.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import OrderSuccess from '../views/OrderSuccess.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MyOrders from '../views/MyOrders.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Admin from '../views/Admin.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/shop', name: 'Shop', component: Shop },
  { path: '/product/:id', name: 'Product', component: Product },
  { path: '/cart', name: 'Cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },
  { path: '/order-success/:id', name: 'OrderSuccess', component: OrderSuccess, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login, meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guestOnly: true } },
  { path: '/my-orders', name: 'MyOrders', component: MyOrders, meta: { requiresAuth: true } },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
   { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/products', name: 'AdminProducts', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/categories', name: 'AdminCategories', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/orders', name: 'AdminOrders', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const authStore = JSON.parse(localStorage.getItem('auth_user') || 'null')
  const isAuthenticated = !!authStore?.user
  const isAdmin = authStore?.profile?.role === 'admin'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'Home' })
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router