
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ICurentUser } from '@/types';



const initialState: ICurentUser = {
  id: null,
  email: null,
  access_token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.id = action.payload.user.id;
      state.email = action.payload.user.email;
      state.access_token = action.payload.session.access_token;

    },
    logout: (state) => {
      state.id = null;
      state.email = null;
      state.access_token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
