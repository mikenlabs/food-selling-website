import supabase from '../config/supabase.js'

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = user
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    req.profile = profile
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

export const requireAdmin = async (req, res, next) => {
  if (!req.profile || req.profile.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export const validateOrder = async (req, res, next) => {
  const { total, items } = req.body

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' })
  }

  let calculatedTotal = 0

  for (const item of items) {
    const { data: product, error } = await supabase
      .from('products')
      .select('price, stock, is_available')
      .eq('id', item.product_id)
      .single()

    if (error || !product) {
      return res.status(400).json({ error: `Product ${item.product_id} not found` })
    }

    if (!product.is_available) {
      return res.status(400).json({ error: `Product ${item.product_id} is not available` })
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Not enough stock for product ${item.product_id}` })
    }

    calculatedTotal += product.price * item.quantity
  }

  if (Math.abs(calculatedTotal - total) > 1) {
    return res.status(400).json({
      error: 'Total mismatch: server-calculated total does not match submitted total'
    })
  }

  req.validatedTotal = calculatedTotal
  next()
}

export const verifyPayment = async (req, res, next) => {
  const { payment_ref, provider } = req.body

  if (!payment_ref || !provider) {
    return res.status(400).json({ error: 'Payment reference and provider are required' })
  }

  const paymentService = (await import('../services/paymentService.js')).default
  const result = await paymentService.verifyOrderPayment(payment_ref, provider)

  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }

  req.paymentResult = result
  next()
}