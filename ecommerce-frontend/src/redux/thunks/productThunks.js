import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Fetch all products with query parameters (search, filter, sort)
export const fetchProductsThunk = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

// Fetch single product details
export const fetchProductDetailThunk = createAsyncThunk(
  'products/fetchProductDetail',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch product details';
      return rejectWithValue(message);
    }
  }
);

// Fetch distinct categories
export const fetchCategoriesThunk = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/products/categories/all');
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to load categories';
      return rejectWithValue(message);
    }
  }
);

// Fetch RapidMiner Recommendations (AI Tailored)
export const fetchRapidMinerRecommendationsThunk = createAsyncThunk(
  'products/fetchRapidMinerRecommendations',
  async (category = '', { rejectWithValue }) => {
    try {
      const url = category
        ? `/analytics/recommendations?category=${encodeURIComponent(category)}`
        : '/analytics/recommendations';
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to load recommendations';
      return rejectWithValue(message);
    }
  }
);

// Fetch Product Specific Recommendations (Frequently Bought Together)
export const fetchProductRecommendationsThunk = createAsyncThunk(
  'products/fetchProductRecommendations',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/analytics/recommendations/${productId}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to load related products';
      return rejectWithValue(message);
    }
  }
);

// Create product (Admin)
export const createProductThunk = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/products', productData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to create product';
      return rejectWithValue(message);
    }
  }
);

// Update product (Admin)
export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update product';
      return rejectWithValue(message);
    }
  }
);

// Delete product (Admin)
export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to delete product';
      return rejectWithValue(message);
    }
  }
);
