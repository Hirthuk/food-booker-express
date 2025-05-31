import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { getFavorites, addFavorite, removeFavorite } from '../controllers/Favourite.js'

const router = express.Router()

// Simplified routes
router.get('/', authMiddleware, getFavorites)
router.post('/:itemId', authMiddleware, addFavorite)
router.delete('/:itemId', authMiddleware, removeFavorite)

export default router