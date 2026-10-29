import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Async thunk for user login
export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const userData = response.data.data;
      localStorage.setItem('userInfo', JSON.stringify(userData));
      return userData;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for user registration
export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, phone, address }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
        phone,
        address,
      });
      const userData = response.data.data;
      localStorage.setItem('userInfo', JSON.stringify(userData));
      return userData;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for updating user profile
export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/users/profile', profileData);
      const updatedUser = response.data.data;
      const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const merged = { ...stored, ...updatedUser };
      localStorage.setItem('userInfo', JSON.stringify(merged));
      return merged;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Profile update failed';
      return rejectWithValue(message);
    }
  }
);
