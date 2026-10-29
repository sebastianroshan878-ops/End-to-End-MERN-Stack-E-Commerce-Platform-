const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');
const connectDB = require('./config/dbConnection');

dotenv.config();

const seedProducts = [
  {
    name: 'Apple MacBook Pro 16" M3 Max',
    description: 'Blazing-fast Apple M3 Max chip with 16-core CPU, 40-core GPU, 36GB unified memory, and 1TB SSD storage. Liquid Retina XDR display with ProMotion.',
    price: 2499.99,
    category: 'Electronics',
    brand: 'Apple',
    stock: 12,
    rating: 4.9,
    numReviews: 48,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    tags: ['laptop', 'apple', 'm3', 'macbook', 'pro'],
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Exceptional sound quality with Hi-Res Audio wireless and 30-hour battery life.',
    price: 398.00,
    category: 'Audio',
    brand: 'Sony',
    stock: 25,
    rating: 4.8,
    numReviews: 95,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    tags: ['headphones', 'audio', 'noise-cancelling', 'sony', 'wireless'],
  },
  {
    name: 'Logitech MX Master 3S Ergonomic Mouse',
    description: 'Quiet click performance mouse with 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, and ergonomic comfortable silhouette.',
    price: 99.99,
    category: 'Accessories',
    brand: 'Logitech',
    stock: 40,
    rating: 4.9,
    numReviews: 140,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    tags: ['mouse', 'logitech', 'ergonomic', 'bluetooth', 'accessories'],
  },
  {
    name: 'Apple iPhone 15 Pro Titanium 256GB',
    description: 'Forged in aerospace-grade titanium with the groundbreaking A17 Pro chip, customizable Action button, and versatile 48MP camera system.',
    price: 1099.00,
    category: 'Electronics',
    brand: 'Apple',
    stock: 18,
    rating: 4.9,
    numReviews: 110,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02597?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    tags: ['phone', 'iphone', 'apple', 'smartphone', '5g'],
  },
  {
    name: 'Anker MagGo Qi2 10000mAh Power Bank',
    description: 'Ultra-fast 15W wireless magnetic portable charger with smart digital display and foldable kickstand for all day productivity.',
    price: 69.99,
    category: 'Accessories',
    brand: 'Anker',
    stock: 35,
    rating: 4.7,
    numReviews: 62,
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    tags: ['charger', 'power bank', 'anker', 'wireless', 'accessories'],
  },
  {
    name: 'Apple Watch Ultra 2 GPS + Cellular',
    description: 'Rugged titanium case with bright 3000-nit Always-On Retina display, dual-frequency GPS, and up to 72 hours of battery life in low power mode.',
    price: 799.00,
    category: 'Wearables',
    brand: 'Apple',
    stock: 14,
    rating: 4.8,
    numReviews: 54,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    tags: ['watch', 'smartwatch', 'apple', 'fitness', 'wearables'],
  },
  {
    name: 'HyperDrive 7-in-1 USB-C Hub Adapter',
    description: 'Precision milled aluminum hub supporting 4K HDMI 60Hz, 100W USB-C Power Delivery, SD/MicroSD slots, and dual USB-A 3.1 ports.',
    price: 49.99,
    category: 'Accessories',
    brand: 'HyperDrive',
    stock: 60,
    rating: 4.6,
    numReviews: 82,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    tags: ['hub', 'usb-c', 'adapter', 'accessories', 'laptop'],
  },
  {
    name: 'Sony Alpha A7 IV Full-Frame Camera',
    description: '33MP BSI CMOS full-frame sensor, 4K 60p 10-bit video, real-time eye AF tracking for human, animal, and bird photography.',
    price: 2398.00,
    category: 'Photography',
    brand: 'Sony',
    stock: 8,
    rating: 4.9,
    numReviews: 36,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    tags: ['camera', 'sony', 'photography', '4k', 'mirrorless'],
  },
  {
    name: 'Peak Design Everyday Sling Bag 6L',
    description: 'Weatherproof 100% recycled nylon canvas sling bag tailored for cameras, daily tech gear, tablets, and travel essentials.',
    price: 119.95,
    category: 'Accessories',
    brand: 'Peak Design',
    stock: 22,
    rating: 4.8,
    numReviews: 44,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    tags: ['bag', 'accessories', 'camera', 'travel', 'peak design'],
  },
  {
    name: 'Nike Air Max Pulse Casual Running Shoes',
    description: 'Point-loaded cushioning system with plush foam midsole and breathable mesh upper for supreme comfort and contemporary street style.',
    price: 149.99,
    category: 'Footwear',
    brand: 'Nike',
    stock: 30,
    rating: 4.7,
    numReviews: 73,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    tags: ['shoes', 'sneakers', 'nike', 'running', 'footwear'],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing existing data...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Creating admin and user accounts...');
    const adminUser = await User.create({
      name: 'Admin Supervisor',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
      address: {
        street: '42 Silicon Boulevard',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
      },
    });

    const standardUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      phone: '+91 9123456780',
      address: {
        street: '15 High Street Mall',
        city: 'Kochi',
        state: 'Kerala',
        postalCode: '682001',
        country: 'India',
      },
    });

    console.log('[Seeder] Populating products...');
    const createdProducts = await Product.insertMany(seedProducts);

    console.log('[Seeder] Creating sample orders for user...');
    await Order.create({
      user: standardUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id, // MacBook Pro
          name: createdProducts[0].name,
          qty: 1,
          price: createdProducts[0].price,
          image: createdProducts[0].image,
        },
        {
          product: createdProducts[2]._id, // Logitech Mouse
          name: createdProducts[2].name,
          qty: 1,
          price: createdProducts[2].price,
          image: createdProducts[2].image,
        },
      ],
      shippingAddress: {
        address: '15 High Street Mall',
        city: 'Kochi',
        postalCode: '682001',
        country: 'India',
      },
      paymentMethod: 'Credit Card / UPI',
      itemsPrice: 2599.98,
      taxPrice: 259.99,
      shippingPrice: 0.0,
      totalPrice: 2859.97,
      isPaid: true,
      paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'Delivered',
    });

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Admin Login:    admin@example.com / admin123`);
    console.log(`User Login:     john@example.com / user123`);
    console.log(`Products added: ${createdProducts.length}`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Failed]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
