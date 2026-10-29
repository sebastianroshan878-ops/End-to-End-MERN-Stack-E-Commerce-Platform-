import { createSlice } from '@reduxjs/toolkit';
import {
  createOrderThunk,
  getMyOrdersThunk,
  getOrderDetailsThunk,
  getAllOrdersThunk,
  updateOrderStatusThunk,
} from '../thunks/orderThunks';

const initialState = {
  orders: [],
  orderDetails: null,
  allOrders: [],
  loading: false,
  detailLoading: false,
  success: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderSuccess: (state) => {
      state.success = false;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders.unshift(action.payload);
        state.orderDetails = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get My Orders
    builder
      .addCase(getMyOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Order Details
    builder
      .addCase(getOrderDetailsThunk.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetailsThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetailsThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });

    // Get All Orders (Admin)
    builder
      .addCase(getAllOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(getAllOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Order Status (Admin)
    builder.addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
      const idx = state.allOrders.findIndex((o) => o._id === action.payload._id);
      if (idx !== -1) {
        state.allOrders[idx] = action.payload;
      }
      if (state.orderDetails?._id === action.payload._id) {
        state.orderDetails = action.payload;
      }
    });
  },
});

export const { resetOrderSuccess, clearOrderDetails, clearOrderError } =
  orderSlice.actions;

export default orderSlice.reducer;
