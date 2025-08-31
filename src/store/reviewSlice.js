import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmPopUpOpened: false,
};

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    openConfirmPopUp: (state, action) => {
      state.confirmPopUpOpened = action.payload;
    },
  },
});

export default reviewSlice.reducer;
export const { openConfirmPopUp } = reviewSlice.actions;
