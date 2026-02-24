
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ICurentUser } from '@/types';



const initialState: ICurentUser = {
  id: "",
  email: "",
  access_token: "",
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
      state.id = "";
      state.email = "";
      state.access_token = "";
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
