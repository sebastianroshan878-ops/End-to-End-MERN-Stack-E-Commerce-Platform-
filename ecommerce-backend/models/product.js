const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      default: 0.0,
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please select product category'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please enter product brand'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please enter product stock count'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Please provide product image URL'],
    },
    images: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    rapidMinerRules: {
      affinityCategories: [String],
      recommendedProductIds: [String],
      confidenceScore: { type: Number, default: 0.85 },
      lift: { type: Number, default: 1.6 },
    },
  },
  {
    timestamps: true,
  }
);

// Search index for text search
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
