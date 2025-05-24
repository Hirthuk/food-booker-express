import express from 'express';
import { config } from 'dotenv';
import connectCloudinary from './config/cloudinary.js';
import {connectDb} from './config/connectDb.js';
import ShopRoutes from './routes/ShopRouter.js';
import cors from 'cors'
const app = express();
const port = process.env.PORT || 4000

// Enabling cors of cross origin access between frontend to backend to make request
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true // If using cookies/auth
}))

// Make use of dotenv configurationin the server
config();

// Database configuration
connectDb();
// Cloudinary configuration
connectCloudinary();
app.use('/api/shops', ShopRoutes);

app.get('/',(req,res) => {
    res.json({
        success: true,
        message: "API working fine"
    })
})

app.listen(port, () => {
    console.log(`API is working at port ${port}`);
} )