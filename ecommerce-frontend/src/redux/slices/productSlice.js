import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProductsThunk,
  fetchProductDetailThunk,
  fetchCategoriesThunk,
  fetchRapidMinerRecommendationsThunk,
  fetchProductRecommendationsThunk,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
} from '../thunks/productThunks';

const initialState = {
  products: [],
  product: null,
  categories: ['Electronics', 'Accessories', 'Audio', 'Wearables', 'Photography', 'Footwear'],
  recommendations: [],
  recommendationMeta: null,
  relatedRecommendations: [],
  loading: false,
  detailLoading: false,
  recommendationsLoading: false,
  error: null,
  page: 1,
  pages: 1,
  totalCount: 0,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductDetail: (state) => {
      state.product = null;
      state.relatedRecommendations = [];
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products List
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Product Detail
    builder
      .addCase(fetchProductDetailThunk.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetailThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetailThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });

    // Fetch Categories
    builder.addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        state.categories = action.payload;
      }
    });

    // RapidMiner Recommendations
    builder
      .addCase(fetchRapidMinerRecommendationsThunk.pending, (state) => {
        state.recommendationsLoading = true;
      })
      .addCase(fetchRapidMinerRecommendationsThunk.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload.data || [];
        state.recommendationMeta = {
          model: action.payload.model,
          source: action.payload.recommendationSource,
          confidence: action.payload.averageConfidence,
          lift: action.payload.averageLift,
        };
      })
      .addCase(fetchRapidMinerRecommendationsThunk.rejected, (state) => {
        state.recommendationsLoading = false;
      });

    // Product Related Recommendations
    builder.addCase(fetchProductRecommendationsThunk.fulfilled, (state, action) => {
      state.relatedRecommendations = action.payload.data || [];
    });

    // Admin Create Product
    builder.addCase(createProductThunk.fulfilled, (state, action) => {
      state.products.unshift(action.payload);
      state.totalCount += 1;
    });

    // Admin Update Product
    builder.addCase(updateProductThunk.fulfilled, (state, action) => {
      const index = state.products.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.product?._id === action.payload._id) {
        state.product = action.payload;
      }
    });

    // Admin Delete Product
    builder.addCase(deleteProductThunk.fulfilled, (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);
    });
  },
});

export const { clearProductDetail, clearProductError } = productSlice.actions;
export default productSlice.reducer;
