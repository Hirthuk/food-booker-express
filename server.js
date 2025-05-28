import express from 'express';
import { config } from 'dotenv';
import connectCloudinary from './config/cloudinary.js';
import { connectDb } from './config/connectDb.js';
import ShopRoutes from './routes/ShopRouter.js';
import cors from 'cors';
import UserRoute from './routes/UserRouter.js';

const app = express();
const port = process.env.PORT || 4000;

// 1. Load environment variables FIRST
config();

// 2. Database connection
connectDb();

// 3. Middleware setup (ORDER MATTERS!)
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// These must come BEFORE route definitions
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 4. Cloudinary configuration
connectCloudinary();

// 5. Routes (after all middleware)
app.use('/api/shops', ShopRoutes);
app.use('/api/users', UserRoute);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "API working fine"
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});