import { Router } from 'express'
import orderController from '../controllers/orderController.js'
import { authenticate, requireAdmin, validateOrder } from '../middleware/auth.js'

const router = Router()

router.post('/', authenticate, validateOrder, orderController.create)
router.get('/', authenticate, requireAdmin, orderController.getAll)
router.get('/user/:userId', authenticate, orderController.getByUser)
router.get('/:id', authenticate, orderController.getById)
router.put('/:id/status', authenticate, requireAdmin, orderController.updateStatus)
router.delete('/:id', authenticate, requireAdmin, orderController.delete)

export default router