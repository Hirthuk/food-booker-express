import { sql } from '../config/connectDb.js'

// Get user's favorites with item details
export const getFavorites = async (req, res) => {
    try {
        const userId = req.userId // From auth middleware

        // Debug log
        console.log('Fetching favorites for user:', userId)

        const favorites = await sql`
            SELECT 
                f.favorite_id,
                f.added_at,
                s.item_id,
                s.item_name,
                s.item_price as price,
                s.item_url as image_url,
                s.shop_id
            FROM user_favorites f
            JOIN shopitems s ON f.item_id = s.item_id
            WHERE f.user_id = ${userId}
            ORDER BY f.added_at DESC
        `

        // Debug log
        console.log('Found favorites:', favorites)

        return res.status(200).json({
            success: true,
            favorites
        })
    } catch (error) {
        console.error('Database error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch favorites',
            error: error.message
        })
    }
}

// Add item to favorites
export const addFavorite = async (req, res) => {
    try {
        const userId = req.userId
        const { itemId } = req.params

        // Validate itemId is a number
        const itemIdNum = parseInt(itemId)
        if (isNaN(itemIdNum)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid item ID'
            })
        }

        // Check if item exists in shopitems
        const itemExists = await sql`
            SELECT item_id 
            FROM shopitems 
            WHERE item_id = ${itemIdNum}
        `

        if (itemExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            })
        }

        // Check if already in favorites (using unique constraint)
        const existingFavorite = await sql`
            SELECT favorite_id 
            FROM user_favorites 
            WHERE user_id = ${userId} AND item_id = ${itemIdNum}
        `

        if (existingFavorite.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Item already in favorites'
            })
        }

        // Add to favorites with timestamp
        const newFavorite = await sql`
            INSERT INTO user_favorites (
                user_id,
                item_id,
                added_at
            )
            VALUES (
                ${userId},
                ${itemIdNum},
                CURRENT_TIMESTAMP
            )
            RETURNING favorite_id, added_at
        `

        return res.status(201).json({
            success: true,
            message: 'Added to favorites',
            favorite: {
                favorite_id: newFavorite[0].favorite_id,
                added_at: newFavorite[0].added_at,
                item_id: itemIdNum,
                user_id: userId
            }
        })

    } catch (error) {
        console.error('Add favorite error:', error)
        
        // Handle unique constraint violation
        if (error.code === '23505') { // PostgreSQL unique constraint violation code
            return res.status(400).json({
                success: false,
                message: 'Item already in favorites'
            })
        }

        return res.status(500).json({
            success: false,
            message: 'Error adding to favorites'
        })
    }
}

// Remove from favorites
export const removeFavorite = async (req, res) => {
    try {
        const userId = req.userId
        const { itemId } = req.params

        const result = await sql`
            DELETE FROM user_favorites
            WHERE user_id = ${userId} AND item_id = ${itemId}
        `

        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not in favorites'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Removed from favorites'
        })
    } catch (error) {
        console.error('Remove favorite error:', error)
        return res.status(500).json({
            success: false,
            message: 'Error removing from favorites'
        })
    }
}