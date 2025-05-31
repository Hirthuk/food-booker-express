import { sql } from '../config/connectDb.js'

export const addToCart = async (req, res) => {
    try {
        const userId = req.userId
        const { itemId, quantity = 1 } = req.body

        // Check if item already exists in cart
        const existingItem = await sql`
            SELECT * FROM user_cart 
            WHERE user_id = ${userId} AND item_id = ${itemId}
        `

        if (existingItem.length > 0) {
            // Update quantity
            await sql`
                UPDATE user_cart 
                SET quantity = quantity + ${quantity}
                WHERE user_id = ${userId} AND item_id = ${itemId}
            `
        } else {
            // Add new item
            await sql`
                INSERT INTO user_cart (user_id, item_id, quantity)
                VALUES (${userId}, ${itemId}, ${quantity})
            `
        }

        return res.status(200).json({
            success: true,
            message: 'Item added to cart'
        })
    } catch (error) {
        console.error('Add to cart error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to add item to cart',
            error: error.message
        })
    }
}

export const getCart = async (req, res) => {
    try {
        const userId = req.userId

        const cartItems = await sql`
            SELECT 
                c.cart_id,
                c.quantity,
                c.user_id,
                s.item_id,
                s.item_name,
                s.item_price,
                s.item_url,
                s.shop_id
            FROM user_cart c
            JOIN shopitems s ON c.item_id = s.item_id
            WHERE c.user_id = ${userId}
        `

        return res.status(200).json({
            success: true,
            cart: cartItems
        })
    } catch (error) {
        console.error('Get cart error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch cart',
            error: error.message
        })
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const userId = req.userId
        const { itemId } = req.params
        const { quantity } = req.body

        if (quantity <= 0) {
            await sql`
                DELETE FROM user_cart
                WHERE user_id = ${userId} AND item_id = ${itemId}
            `
        } else {
            await sql`
                UPDATE user_cart
                SET quantity = ${quantity}
                WHERE user_id = ${userId} AND item_id = ${itemId}
            `
        }

        return res.status(200).json({
            success: true,
            message: 'Cart updated successfully'
        })
    } catch (error) {
        console.error('Update cart error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to update cart',
            error: error.message
        })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId
        const { itemId } = req.params

        await sql`
            DELETE FROM user_cart
            WHERE user_id = ${userId} AND item_id = ${itemId}
        `

        return res.status(200).json({
            success: true,
            message: 'Item removed from cart'
        })
    } catch (error) {
        console.error('Remove from cart error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to remove item from cart',
            error: error.message
        })
    }
}