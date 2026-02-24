
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IChatData } from '@/types';

interface ChatState {
  currentChat: IChatData | null;
}

const initialState: ChatState = {
  currentChat: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<IChatData>) => {
      state.currentChat = action.payload;
    },
    clearChat: (state) => {
      state.currentChat = null;
    },
  },
});

export const { setChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
