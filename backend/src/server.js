import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from './config/environment.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { products } from './mock/products.js'
import { categories } from './mock/products.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: config.frontendUrl, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api/', limiter)

// Mock API for development (when Supabase is not configured)
if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.log('Supabase not configured, using mock API')

  app.get('/api/mock/products', (req, res) => {
    res.json({ data: products, count: products.length })
  })

  app.get('/api/mock/products/:id', (req, res) => {
    const product = products.find((p) => p.id === req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json({ data: product })
  })

  app.get('/api/mock/categories', (req, res) => {
    res.json({ data: categories })
  })

  app.post('/api/mock/orders', (req, res) => {
    const order = {
      id: 'ord_' + Date.now(),
      ...req.body,
      status: 'pending',
      payment_status: 'pending',
      created_at: new Date().toISOString(),
    }
    res.status(201).json({ data: order })
  })

  app.post('/api/mock/payments/initialize', (req, res) => {
    res.json({
      success: true,
      reference: 'mock_ref_' + Date.now(),
      authorization_url: 'https://checkout.paystack.com/test?mock=true',
    })
  })

  app.get('/api/mock/payments/verify/:reference', (req, res) => {
    res.json({
      success: true,
      status: 'success',
      amount: 0,
    })
  })
}

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.get('/api', (req, res) => {
  res.json({
    name: 'Chisom\'s Kitchen API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      payments: '/api/payments',
    }
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  })
})

const PORT = config.port
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app