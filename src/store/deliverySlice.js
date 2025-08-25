import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmPopUpOpened: false,
};

const deliverySlice = createSlice({
  name: "deliverySlice",
  initialState,
  reducers: {
    openConfirmPopUp: (state, action) => {
      state.confirmPopUpOpened = action.payload;
    },
  },
});

export default deliverySlice.reducer;
export const { openConfirmPopUp } = deliverySlice.actions;
