import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Fetch product details and format cart item
export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, qty = 1 }, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      const product = response.data.data;

      const item = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: product.stock,
        category: product.category,
        qty: Number(qty),
      };

      return item;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to add item to cart';
      return rejectWithValue(message);
    }
  }
);
