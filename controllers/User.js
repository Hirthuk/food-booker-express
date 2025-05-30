import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sql } from '../config/connectDb.js';
import { config } from 'dotenv';

config();
const createToken = (id) => {
    return jwt.sign({id}, process.env.JSON_SECRET, { expiresIn: '3d' });
}

// Registration controller
const registerUser = async (req, res) => {
    try {
        // Log the request body to debug
        // console.log('Request body:', req.body);

        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user exists
        const existingUsers = await sql`
            SELECT email FROM users WHERE email = ${email}
        `;

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid email"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const newUser = await sql`
            INSERT INTO users (name, email, password_hash)
            VALUES (${name}, ${email}, ${hashedPassword})
            RETURNING user_id, name, email, phone_number, address
        `;

        if (!newUser || newUser.length === 0) {
            throw new Error('Failed to create user');
        }

        // Create token using the correct user_id field
        const token = createToken(newUser[0].user_id);

        // Set cookie with proper options
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
        })
        return res.status(201).json({
            success: true,
            user: {
                id: newUser[0].user_id,
                name: newUser[0].name,
                email: newUser[0].email,
                phoneNumber: newUser[0].phone_number,
                address: newUser[0].address
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

const LoginUser = async(req,res) => {
   try {
        // Add debug logs
        // console.log('Login attempt:', { email: req.body.email });

        const {email, password} = req.body;

        if (!email || !password) {
            // console.log('Missing credentials');
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const users = await sql`
            SELECT user_id, name, email, password_hash, phone_number, address 
            FROM users 
            WHERE email = ${email}
        `;

        if (users.length === 0) {
            console.log('User not found:', email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            // console.log('Password mismatch for:', email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create token
        const token = createToken(user.user_id);
        console.log('Created token:', token);

        // Set cookie with proper options
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });
        console.log('Cookie set with token');

        return res.status(200).json({
            success: true,
            user: {
            id: user.user_id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phone_number,
            address: user.address
            },
            token
        });
   } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
   }
}

// Add new getUserProfile endpoint
const getUserProfile = async (req, res) => {
    try {
        const token = req.cookies.token;
        console.log('Token from cookie:', token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token found"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JSON_SECRET);
        console.log('Decoded token:', decoded);

        // Get user profile
        const users = await sql`
            SELECT user_id, name, email, phone_number, address
            FROM users
            WHERE user_id = ${decoded.id}
        `;

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = users[0];
        return res.status(200).json({
            success: true,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phone_number,
                address: user.address
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching profile"
        });
    }
}

const LogoutUser = async (req, res) => {
    try {
        // Clear the cookie
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.error('Logout error:', error)
        return res.status(500).json({
            success: false,
            message: 'Error during logout'
        })
    }
}

export { registerUser, LoginUser, LogoutUser, getUserProfile };

