import { createSlice } from '@reduxjs/toolkit';
import { addToCartThunk } from '../thunks/cartThunks';

const getInitialCartItems = () => {
  try {
    const item = localStorage.getItem('cartItems');
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

const getInitialShippingAddress = () => {
  try {
    const item = localStorage.getItem('shippingAddress');
    return item
      ? JSON.parse(item)
      : { address: '42 Silicon Boulevard', city: 'Bengaluru', postalCode: '560001', country: 'India' };
  } catch {
    return { address: '', city: '', postalCode: '', country: 'India' };
  }
};

// Calculation helpers in Indian Rupees (INR)
const calculatePrices = (items) => {
  const itemsPrice = Number(
    items.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
  );
  // Free delivery on orders ₹999 and above, otherwise ₹99 delivery fee
  const shippingPrice = itemsPrice >= 999 || itemsPrice === 0 ? 0 : 99;
  // 18% Standard GST
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const initialItems = getInitialCartItems();
const initialPrices = calculatePrices(initialItems);

const initialState = {
  cartItems: initialItems,
  shippingAddress: getInitialShippingAddress(),
  ...initialPrices,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existIndex = state.cartItems.findIndex((x) => x.product === newItem.product);

      if (existIndex !== -1) {
        state.cartItems[existIndex].qty += newItem.qty || 1;
      } else {
        state.cartItems.push(newItem);
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      const prices = calculatePrices(state.cartItems);
      Object.assign(state, prices);
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((x) => x.product !== productId);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      const prices = calculatePrices(state.cartItems);
      Object.assign(state, prices);
    },
    updateQuantity: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.cartItems.find((x) => x.product === productId);
      if (item && qty > 0) {
        item.qty = qty;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        const prices = calculatePrices(state.cartItems);
        Object.assign(state, prices);
      }
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
      const prices = calculatePrices([]);
      Object.assign(state, prices);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        const newItem = action.payload;
        const existIndex = state.cartItems.findIndex((x) => x.product === newItem.product);

        if (existIndex !== -1) {
          state.cartItems[existIndex].qty += newItem.qty;
        } else {
          state.cartItems.push(newItem);
        }

        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        const prices = calculatePrices(state.cartItems);
        Object.assign(state, prices);
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  saveShippingAddress,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
