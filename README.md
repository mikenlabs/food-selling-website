# Chisom's Kitchen - Food Selling & Marketing Website

A responsive, modern food e-commerce website built with Vue 3, Tailwind CSS, and Supabase.

## Tech Stack

| Component            | Technology              |
| -------------------- | ----------------------- |
| Programming Language | JavaScript              |
| Frontend             | Vue.js 3 (Composition API) + Vite |
| Styling              | Tailwind CSS            |
| State Management     | Pinia                   |
| Routing              | Vue Router 4            |
| Backend              | Node.js + Express.js    |
| Database             | Supabase PostgreSQL     |
| Authentication       | Supabase Auth           |
| Image Storage        | Supabase Storage        |
| Payments             | Paystack / Flutterwave  |
| Frontend Hosting     | Vercel                  |
| Backend Hosting      | Render                  |

## Prerequisites

- Node.js >= 18
- npm or yarn

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/food-selling-website.git
   cd food-selling-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your values:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `VITE_API_URL` - Your backend API URL (for payment processing)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
```

This will generate the production-ready files in the `dist/` directory.

## Deploying to Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and import your repository.
3. Add your environment variables in the Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL`
4. Deploy!

## Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/
│   ├── layout/      # AppHeader.vue, AppFooter.vue
│   ├── ui/          # Reusable UI components (Modal, ToastHost, etc.)
│   ├── product/     # Product-related components (ProductCard, HeroCarousel, etc.)
│   ├── cart/        # Cart-related components (CartItem, QuantitySelector)
│   └── admin/       # Admin components (AdminSidebar, ProductForm)
├── views/           # Page views (Home, Shop, Product, Cart, Checkout, etc.)
├── router/          # Vue Router configuration
├── stores/          # Pinia stores (cart, auth, products, ui)
├── services/        # API services (supabaseClient, productService, orderService, etc.)
├── composables/     # Vue composables
├── utils/           # Utility functions (formatCurrency, validators)
├── mock/            # Mock data for development
└── index.css        # Global styles
```

## Features

### Customer Features
- Browse food products with category filters and search
- Product details with image gallery
- Shopping cart with quantity management
- Checkout with delivery details
- Order confirmation and order history
- Customer authentication (login/register)
- Payment integration with Paystack/Flutterwave
- Responsive design for mobile, tablet, and desktop

### Admin Features
- Role-protected admin dashboard
- Product management (add, edit, delete)
- Category management (CRUD)
- Order management (view, update status)
- Image upload via Supabase Storage

## Backend API Endpoints

The frontend expects the following backend API endpoints:

- `POST /api/payments/initialize` - Initialize payment
- `GET /api/payments/verify/:reference` - Verify payment

## Data Schema

Supabase tables used by the frontend:

- **profiles**(id, full_name, phone, role)
- **categories**(id, name, slug)
- **products**(id, name, description, price, image_url, category_id, stock, is_available)
- **orders**(id, user_id, total, status, payment_status, payment_ref, delivery_address, phone, created_at)
- **order_items**(id, order_id, product_id, quantity, unit_price)

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=https://your-backend.com/api
```

## Development Notes

- The frontend runs immediately with mock data even without a configured backend.
- All payment logic goes through the backend for security - the frontend never sets payment status.
- The displayed prices are for display only; the server revalidates all prices before finalizing orders.
- Supabase Row Level Security (RLS) should be enabled for all tables in production.

## License

MIT