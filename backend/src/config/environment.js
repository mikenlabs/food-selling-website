import 'dotenv/config'

export const config = {
  port: process.env.PORT || 5000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
}