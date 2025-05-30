import express from 'express'
import { getFavorites, addFavorite, removeFavorite } from '../controllers/Favourite.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// Get all favorites for authenticated user
router.get('/user-favorites', authMiddleware, getFavorites)

// Add item to favorites
router.post('/add/:itemId', authMiddleware, addFavorite)

// Remove item from favorites
router.delete('/remove/:itemId', authMiddleware, removeFavorite)

// Check if item is in favorites
router.get('/check/:itemId', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId
        const itemId = parseInt(req.params.itemId)

        const favorite = await sql`
            SELECT favorite_id 
            FROM user_favorites 
            WHERE user_id = ${userId} 
            AND item_id = ${itemId}
        `

        return res.status(200).json({
            success: true,
            isFavorite: favorite.length > 0
        })
    } catch (error) {
        console.error('Check favorite error:', error)
        return res.status(500).json({
            success: false,
            message: 'Error checking favorite status'
        })
    }
})

export default router