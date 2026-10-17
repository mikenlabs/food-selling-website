# Chisom's Kitchen - Backend API

Backend API for the Chisom's Kitchen food selling and marketing website.

## Tech Stack

| Component            | Technology              |
| -------------------- | ----------------------- |
| Programming Language | JavaScript (ES Modules) |
| Backend              | Node.js + Express.js    |
| Database             | Supabase PostgreSQL     |
| Authentication       | Supabase Auth           |
| Image Storage        | Supabase Storage        |
| Payments             | Paystack / Flutterwave  |
| Hosting              | Render                  |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Configure your `.env` file with your Supabase credentials and payment provider keys.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. The API will be available at `http://localhost:5000/api`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh access token

### Products
- `GET /api/products` - List all products (with category, search, sort, pagination)
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get a single category
- `POST /api/categories` - Create a category (admin only)
- `PUT /api/categories/:id` - Update a category (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - List all orders (admin only)
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:id` - Get a single order
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `DELETE /api/orders/:id` - Delete an order (admin only)

### Payments
- `POST /api/payments/initialize` - Initialize payment
- `GET /api/payments/verify/:reference` - Verify payment
- `POST /api/payments/webhook` - Payment webhook

## Mock API

When Supabase is not configured, the server runs with mock API endpoints available at:

- `GET /api/mock/products`
- `GET /api/mock/products/:id`
- `GET /api/mock/categories`
- `POST /api/mock/orders`
- `POST /api/mock/payments/initialize`
- `GET /api/mock/payments/verify/:reference`

## Environment Variables

| Variable                  | Description                          |
| ------------------------- | ------------------------------------ |
| SUPABASE_URL              | Your Supabase project URL            |
| SUPABASE_SERVICE_ROLE_KEY | Your Supabase service role key       |
| PAYSTACK_SECRET_KEY       | Paystack API secret key              |
| FLUTTERWAVE_SECRET_KEY    | Flutterwave API secret key           |
| FRONTEND_URL              | Frontend URL for payment redirects   |
| PORT                      | Server port (default: 5000)          |
| NODE_ENV                  | Node environment (development/test)  |

## Security

- All admin endpoints require authentication and admin role
- Order prices are verified server-side
- Payment verification is handled by the backend
- Secret API keys are never exposed to the frontend