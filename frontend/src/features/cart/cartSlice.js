import { createSlice } from '@reduxjs/toolkit';

const getCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cartItems');
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (error) {
    console.error('Failed to parse cart items from localStorage', error);
    return [];
  }
};

const initialState = {
  cartItems: getCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        existItem.quantity += item.quantity;
        if (item.stock !== undefined && existItem.quantity > item.stock) {
          existItem.quantity = item.stock;
        }
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const existItem = state.cartItems.find((x) => x._id === _id);
      if (existItem) {
        existItem.quantity = quantity;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
