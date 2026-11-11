const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const seedProducts = require('../data/seedProducts');

/**
 * Checks if the database is empty and auto-seeds catalog, accounts, and sample orders.
 * Safe to run on every startup / connection: only inserts if products count is 0.
 */
const autoSeedIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return false;
    }

    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      return true; // Already seeded
    }

    console.log('[Auto-Seed] Empty database detected. Populating 42 products and demo accounts...');

    // 1. Seed demo users if not present
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      adminUser = await User.create({
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
    }

    let standardUser = await User.findOne({ email: 'john@example.com' });
    if (!standardUser) {
      standardUser = await User.create({
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
    }

    // 2. Insert 42 categorized products
    const createdProducts = await Product.insertMany(seedProducts);
    console.log(`[Auto-Seed] Successfully inserted ${createdProducts.length} products.`);

    // 3. Create initial sample order for recommendations
    const macbook = createdProducts.find((p) => p.name.includes('MacBook')) || createdProducts[0];
    const mouse = createdProducts.find((p) => p.name.includes('Logitech MX Master')) || createdProducts[1];

    const itemsSubtotal = (macbook.price || 249900) + (mouse.price || 8995);
    const taxAmount = Math.round(itemsSubtotal * 0.18);
    const orderTotal = itemsSubtotal + taxAmount;

    await Order.create({
      user: standardUser._id,
      orderItems: [
        {
          product: macbook._id,
          name: macbook.name,
          qty: 1,
          price: macbook.price,
          image: macbook.image,
        },
        {
          product: mouse._id,
          name: mouse.name,
          qty: 1,
          price: mouse.price,
          image: mouse.image,
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
      shippingPrice: 0,
      totalPrice: orderTotal,
      isPaid: true,
      paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'Delivered',
    });

    console.log('[Auto-Seed] Database initial seeding completed successfully.');
    return true;
  } catch (error) {
    console.error('[Auto-Seed Error]:', error.message);
    return false;
  }
};

module.exports = { autoSeedIfEmpty };
