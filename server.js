import express from 'express';
import { config } from 'dotenv';
import connectCloudinary from './config/cloudinary.js';
import { connectDb } from './config/connectDb.js';
import ShopRoutes from './routes/ShopRouter.js';
import cors from 'cors';
import UserRoute from './routes/UserRouter.js';
import cookieParser from 'cookie-parser';
import favouritesRouter from './routes/Favourites.js'
import cartRouter from './routes/CartRoute.js'

const app = express();
const port = process.env.PORT || 4000;

// 1. Load environment variables FIRST
config();

// 2. Database connection
connectDb();

// 3. Middleware setup (ORDER MATTERS!)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// SINGLE CORS middleware (no duplicates!)
const allowedOrigins = ['https://foodbooker.netlify.app', 'http://localhost:5173'];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Preflight handler (for legacy clients)
app.options('*', cors());

// 4. Cloudinary configuration
connectCloudinary();

// 5. Routes (after all middleware)
app.use('/api/shops', ShopRoutes);
app.use('/api/users', UserRoute);
app.use('/api/favorites', favouritesRouter);
app.use('/api/cart', cartRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "API working fine"
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});