import jwt from 'jsonwebtoken'
import { sql } from '../config/connectDb.js'

export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing or invalid format'
            })
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            })
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JSON_SECRET)
            
            // Check if user exists
            const users = await sql`
                SELECT user_id FROM users WHERE user_id = ${decoded.id}
            `

            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                })
            }

            // Add user ID to request
            req.userId = decoded.id
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired'
                })
            }
            
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            })
        }
    } catch (error) {
        console.error('Auth middleware error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}