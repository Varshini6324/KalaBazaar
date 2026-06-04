import { createSlice } from '@reduxjs/toolkit';

const getUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    return serializedUser ? JSON.parse(serializedUser) : null;
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    return null;
  }
};

const user = getUserFromStorage();

const initialState = {
  user: user,
  token: user ? user.token : null,
  isAuthenticated: !!user,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
