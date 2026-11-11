const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');
const connectDB = require('./config/dbConnection');
const seedProducts = require('./data/seedProducts');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing existing catalog, accounts, and orders...');
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

    console.log('[Seeder] Populating 42 category-accurate products in INR...');
    const createdProducts = await Product.insertMany(seedProducts);

    console.log('[Seeder] Creating initial user order in INR...');
    const macbook = createdProducts.find((p) => p.name.includes('MacBook'));
    const mouse = createdProducts.find((p) => p.name.includes('Logitech MX Master'));

    const itemsSubtotal = (macbook?.price || 249900) + (mouse?.price || 8995);
    const taxAmount = Math.round(itemsSubtotal * 0.18);
    const shippingCharge = 0; // Free shipping above ₹999
    const orderTotal = itemsSubtotal + taxAmount + shippingCharge;

    await Order.create({
      user: standardUser._id,
      orderItems: [
        {
          product: macbook?._id || createdProducts[0]._id,
          name: macbook?.name || 'Apple MacBook Pro 16" M3 Max',
          qty: 1,
          price: macbook?.price || 249900,
          image: macbook?.image || createdProducts[0].image,
        },
        {
          product: mouse?._id || createdProducts[7]._id,
          name: mouse?.name || 'Logitech MX Master 3S Ergonomic Wireless Mouse',
          qty: 1,
          price: mouse?.price || 8995,
          image: mouse?.image || createdProducts[7].image,
        },
      ],
      shippingAddress: {
        address: '15 High Street Mall',
        city: 'Kochi',
        postalCode: '682001',
        country: 'India',
      },
      paymentMethod: 'UPI / Net Banking',
      itemsPrice: itemsSubtotal,
      taxPrice: taxAmount,
      shippingPrice: shippingCharge,
      totalPrice: orderTotal,
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
    console.log(`Total Products: ${createdProducts.length} (7 per category)`);
    console.log('Categories:     Electronics, Accessories, Audio, Footwear, Photography, Wearables');
    console.log('Currency:       INR (₹) formatted with Indian numbering system');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Failed]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
