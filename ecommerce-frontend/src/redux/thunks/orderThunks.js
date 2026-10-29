import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { clearCart } from '../slices/cartSlice';

// Create a new order
export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      // Automatically clear cart upon successful order
      dispatch(clearCart());
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to place order';
      return rejectWithValue(message);
    }
  }
);

// Fetch logged-in user orders
export const getMyOrdersThunk = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders/myorders');
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch user orders';
      return rejectWithValue(message);
    }
  }
);

// Fetch order details by ID
export const getOrderDetailsThunk = createAsyncThunk(
  'orders/getOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch order details';
      return rejectWithValue(message);
    }
  }
);

// Fetch all orders (Admin only)
export const getAllOrdersThunk = createAsyncThunk(
  'orders/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders');
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to load admin orders';
      return rejectWithValue(message);
    }
  }
);

// Update order status (Admin only)
export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/status`, { status });
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update order status';
      return rejectWithValue(message);
    }
  }
);
