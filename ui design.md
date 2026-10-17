You are a senior front-end engineer. Build the COMPLETE FRONT END of a food selling and marketing website, based on the PRD summary and wireframe description below. Build only the front end (no Express backend). Where the backend or Supabase is needed, use a clean service layer with mock data fallback so the app runs immediately.

## 1. Tech stack (strict)

- Vue 3 (Composition API, <script setup>) + Vite, JavaScript only (no TypeScript)
- Tailwind CSS for all styling
- Vue Router 4, Pinia (cart, auth, UI state)
- @supabase/supabase-js (auth, products, categories, orders, image storage), reading VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env. Never put secret keys or payment secrets in front-end code.
- Payments: Paystack or Flutterwave inline checkout via a service wrapper. The front end only calls a backend endpoint (VITE_API_URL) to initialize and verify payment. Never mark an order as paid on the client.
- Deployable on Vercel

## 2. Wireframe to build (Home page, mobile-first, portrait)

From top to bottom:

1. Header: small logo box at top-left (logo + brand name), with a hamburger menu, search icon, and cart icon with item-count badge on the right.
2. Hero banner (wide rectangle): a large CIRCULAR featured food image on the left, with headline, short promo text, and a "Order Now" button on the right. Make it a swipeable carousel of promotional banners.
3. Featured products: a 2x2 grid of square product cards. Each card has a square image, name, price, availability badge, and an "Add to cart" button. Include a "View all" link.
4. Wide bottom banner (full-width rectangle): a promo or CTA block, such as "Free delivery on orders above X" or "Order for events", with a button.
5. Remaining space: footer with quick links, contact info, social icons, and copyright.
   On tablet and desktop, the grid expands to 3-4 columns, the hero becomes a two-column layout, and the header shows full navigation links.

## 3. Pages and routes

/ Home | /shop (catalogue with category filters, search, sort, pagination or infinite scroll) | /product/:id (image gallery, description, price, availability, quantity selector, add to cart, related items) | /cart | /checkout (contact + delivery form, order summary, pay button) | /order-success/:id | /login and /register | /my-orders (history with status badges) | /about | /contact (business info + message form) | /admin (dashboard) | 404 page

## 4. Admin dashboard (front end, role-protected)

- Route guard: only users with role "admin" (from Supabase profile) can access /admin/\*
- Sections: Products (table with add, edit, delete, image upload to Supabase Storage, price, stock, availability toggle), Categories (CRUD), Orders (list, filter by status, order detail, status dropdown: pending, paid, preparing, out for delivery, delivered, cancelled)
- Responsive sidebar layout, confirmation modals for destructive actions, toast feedback

## 5. Functional requirements

- Cart: add, remove, change quantity, persist in localStorage, live subtotal, disable out-of-stock items
- Auth: register, login, logout, session persistence, redirect to the intended page after login, guarded routes for checkout, my-orders and admin
- Checkout: validated form (name, phone, address, notes), show total, call the payment service, then show the success or failure state. The displayed price is for display only, since the server revalidates prices.
- Search: debounced, with category filter
- Loading skeletons, empty states, and error states on every data view
- Toast notifications for add to cart, errors, and success

## 6. Design requirements

- Clean, modern, food-focused. Light background (warm off-white), one warm accent color (e.g. orange or tomato red), dark neutral text, rounded-2xl cards, soft shadows
- Appetizing imagery, with lazy-loaded images, aspect-square ratios, and object-cover
- Readable typography (Google font pair, e.g. Poppins + Inter), consistent spacing scale
- Mobile-first, fully responsive for mobile, tablet, desktop
- Subtle hover and transition effects, sticky header, accessible contrast, keyboard focus states, alt text and aria-labels

## 7. Project structure

src/
assets/, components/ (layout, ui, product, cart, admin), views/, router/, stores/ (cart, auth, products, ui), services/ (supabaseClient, productService, orderService, paymentService, authService), composables/, utils/ (formatCurrency in Naira, validators), mock/ (sample products and categories)
Also provide: .env.example, tailwind.config.js, vite.config.js, package.json, vercel.json (SPA rewrite), and a README with setup, env variables, and run instructions.

## 8. Data shapes (for Supabase tables the front end expects)

profiles(id, full_name, phone, role) | categories(id, name, slug) | products(id, name, description, price, image_url, category_id, stock, is_available) | orders(id, user_id, total, status, payment_status, payment_ref, delivery_address, phone, created_at) | order_items(id, order_id, product_id, quantity, unit_price)

## 9. Output rules

- Produce complete, working code for every file, with no placeholders or "etc."
- Include 8-12 realistic mock food products (Nigerian dishes and snacks, with prices in ₦) so the UI looks real out of the box
- Use reusable components (ProductCard, CartItem, CategoryChips, HeroCarousel, PromoBanner, AppHeader, AppFooter, ToastHost, Modal, etc.)
- Build in this order: setup and config, layout and router, stores and services, Home page matching the wireframe, Shop and Product pages, Cart and Checkout, Auth and My Orders, About and Contact, Admin dashboard
- End with a short checklist of the PRD success criteria, noting what is done and what needs the backend
