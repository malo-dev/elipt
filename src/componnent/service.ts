import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://elipt-test-api.onrender.com";

// Sign Up
export const signUp = createAsyncThunk("auth/signUp", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/AppUsers/SignUp`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Verify OTP
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (otpData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/AppUsers/ActiveAccount/verifyCode`, otpData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Configure Account
export const configAccount = createAsyncThunk("auth/configAccount", async (configData, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/AppUsers/ActiveAccount/ConfigAccount`, configData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Sign In
export const signIn = createAsyncThunk("auth/signIn", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/AppUsers/SignIn`, credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch Products
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Product/getOtherProduct`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create Product
export const createProduct = createAsyncThunk("products/createProduct", async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Product/Create`, productData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete Product
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (productId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/Product/delete/${productId}`);
    return productId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Update Product
export const updateProduct = createAsyncThunk("products/updateProduct", async ({ productId, productData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/Product/update/${productId}`, productData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => { state.loading = true; })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      });
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product.id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  }
});

export { authSlice, productSlice };
export default { authSlice, productSlice };
