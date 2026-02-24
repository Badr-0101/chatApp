import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSidebarOpen: false,
};

const styleSlice = createSlice({
    name: "style",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
    },
});

export const { toggleSidebar } = styleSlice.actions;
export default styleSlice.reducer;

