const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConnection');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const authenticationRoutes = require('./routes/authenticationRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev / flexible deployment
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connected on each request (crucial for serverless environments)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in request', err);
  }
  next();
});

// Health / Welcome Route
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'online',
    message: 'MERN Stack E-Commerce Platform API is running',
    version: '1.0.0',
    documentation: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      analytics: '/api/analytics',
    },
  });
});

// API Routes Mounting
app.use('/api/auth', authenticationRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`[Server Error] Port ${PORT} is already in use.`);
    } else {
      console.error(`[Server Error] ${error.message}`);
    }
  });
}

module.exports = app;
