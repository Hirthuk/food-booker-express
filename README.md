# FoodBooker Backend

A robust Node.js/Express backend for the FoodBooker food ordering application. This server handles user authentication, order management, and payment processing.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure password hashing
  - Token refresh mechanism

- **Database Integration**
  - PostgreSQL database
  - Efficient SQL queries
  - Transaction support
  - Connection pooling

- **API Endpoints**
  - RESTful architecture
  - Input validation
  - Error handling
  - Rate limiting

- **Payment Integration**
  - Razorpay integration
  - Payment verification
  - Order status tracking
  - Refund handling

## 🛠️ Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens
- Bcrypt
- Cors
- Dotenv
- Razorpay

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/foodbooker-backend.git
cd foodbooker-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=4000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=foodbooker
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. Set up the database:
```bash
psql -U postgres
CREATE DATABASE foodbooker;
```

5. Run migrations:
```bash
npm run migrate
```

6. Start the server:
```bash
npm run dev
```

## 📚 API Documentation

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
POST /api/auth/refresh - Refresh token
```

### Users
```
GET /api/users/profile - Get user profile
PUT /api/users/profile - Update profile
```

### Shops
```
GET /api/shops - Get all shops
GET /api/shops/:id - Get shop details
GET /api/shops/:id/items - Get shop items
```

### Cart
```
GET /api/cart - Get user's cart
POST /api/cart/add - Add item to cart
PUT /api/cart/:itemId - Update cart item
DELETE /api/cart/:itemId - Remove from cart
```

### Orders
```
POST /api/orders/create - Create order
GET /api/orders - Get user's orders
GET /api/orders/:id - Get order details
```

### Favorites
```
GET /api/favorites - Get user's favorites
POST /api/favorites/:itemId - Add to favorites
DELETE /api/favorites/:itemId - Remove from favorites
```

## 📁 Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── utils/         # Utility functions
└── app.js         # Express app setup
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port number |
| DB_HOST | Database host |
| DB_USER | Database user |
| DB_PASS | Database password |
| DB_NAME | Database name |
| JWT_SECRET | JWT signing secret |
| RAZORPAY_KEY_ID | Razorpay API key |
| RAZORPAY_KEY_SECRET | Razorpay secret key |

## 📊 Database Schema

```sql
-- Key tables
users
shops
shopitems
user_cart
orders
order_items
user_favorites
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data
- `npm test` - Run tests

## 🔍 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

## 🔒 Security Features

- CORS configuration
- Rate limiting
- Input sanitization
- SQL injection protection
- XSS protection
- Helmet security headers

## 🧪 Testing

```bash
npm install --save-dev jest supertest
npm test
```

## 📈 Performance

- Connection pooling
- Query optimization
- Response caching
- Compression

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
