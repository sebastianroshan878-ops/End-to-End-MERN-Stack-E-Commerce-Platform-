import { createSlice } from '@reduxjs/toolkit';
import {
  loginUserThunk,
  registerUserThunk,
  updateProfileThunk,
} from '../thunks/authThunks';

const getInitialUser = () => {
  try {
    const item = localStorage.getItem('userInfo');
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const initialState = {
  userInfo: getInitialUser(),
  loading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    resetAuthSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError, resetAuthSuccess } = authSlice.actions;
export default authSlice.reducer;
