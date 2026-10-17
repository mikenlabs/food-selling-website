import { Router } from 'express'
import productController from '../controllers/productController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', productController.getAll)
router.get('/:id', productController.getById)

router.post('/', authenticate, requireAdmin, productController.create)
router.put('/:id', authenticate, requireAdmin, productController.update)
router.delete('/:id', authenticate, requireAdmin, productController.delete)
router.post('/:id/upload', authenticate, requireAdmin, productController.uploadImage)

export default router