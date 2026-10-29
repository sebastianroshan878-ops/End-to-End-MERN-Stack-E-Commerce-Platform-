# E-Commerce Platform - Backend API

Robust, scalable Node.js + Express + MongoDB RESTful API built for the End-to-End MERN Stack E-Commerce Platform assignment.

## Tech Stack & Architecture
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
- **Recommendation Engine**: RapidMiner FP-Growth Association Rule Mining Integration
- **Role-Based Access Control**: Granular `user` and `admin` permission middleware

## Folder Structure
```
ecommerce-backend/
├── index.js                     # Main entry point for Express server
├── config/
│   └── dbConnection.js          # MongoDB connection setup
├── models/
│   ├── user.js                  # User schema & bcrypt methods
│   ├── product.js               # Product schema & text search indexes
│   └── order.js                 # Order schema, line items & status
├── controllers/
│   ├── authentication.js        # Registration, login & JWT generation
│   ├── userProfile.js           # User profile & Admin user management
│   ├── productController.js     # Product CRUD, filters, search & sorting
│   ├── orderController.js       # Order creation, updates & tracking
│   └── analyticsController.js   # RapidMiner Recommendation System integration
├── routes/
│   ├── authenticationRoutes.js  # /api/auth endpoints
│   ├── userProfileRoutes.js     # /api/users endpoints
│   ├── productRoutes.js         # /api/products endpoints
│   ├── orderRoutes.js           # /api/orders endpoints
│   └── analyticsRoutes.js       # /api/analytics endpoints
├── middleware/
│   ├── authMiddleware.js        # JWT verify & RBAC check
│   └── errorHandler.js          # Centralized error handler
├── seed.js                      # Database seeder with sample accounts & catalog
├── .env                         # Environment variables configuration
└── package.json
```

## Setup & Running Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_db
   JWT_SECRET=supersecret_mern_jwt_key_2026_secure
   NODE_ENV=development
   ```

3. Seed demo data:
   ```bash
   npm run seed
   ```
   - **Admin Credentials**: `admin@example.com` / `admin123`
   - **User Credentials**: `john@example.com` / `user123`

4. Run the server:
   ```bash
   npm run dev   # Runs with nodemon on port 5000
   ```

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create user account & receive token
- `POST /api/auth/login` - Authenticate user & receive token
- `GET /api/auth/me` - Authenticated user details (Protected)

### Products (`/api/products`)
- `GET /api/products` - List products with search (`keyword`), filters (`category`, `minPrice`, `maxPrice`, `inStock`), and sorting (`sortBy`)
- `GET /api/products/:id` - Single product details
- `GET /api/products/categories/all` - Distinct categories
- `GET /api/products/top/rated` - Top rated products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders (`/api/orders`)
- `POST /api/orders` - Place order (Protected)
- `GET /api/orders/myorders` - Logged in user orders (Protected)
- `GET /api/orders/:id` - Order details (Protected)
- `GET /api/orders` - All orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Analytics & Recommendations (`/api/analytics`)
- `GET /api/analytics/recommendations` - RapidMiner FP-Growth powered recommendations
- `GET /api/analytics/recommendations/:productId` - Frequently bought together complementary items
- `GET /api/analytics/rapidminer-model` - RapidMiner Model metadata, support, confidence & lift table
