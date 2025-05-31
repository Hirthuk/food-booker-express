import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { 
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
} from '../controllers/Cart.js'

const router = express.Router()

router.post('/add', authMiddleware, addToCart)
router.get('/', authMiddleware, getCart)
router.put('/:itemId', authMiddleware, updateCartItem)
router.delete('/:itemId', authMiddleware, removeFromCart)

export default router