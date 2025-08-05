import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deliveryOpened: false,
  assignOrderOpened: false,
  deliveryDetails: false,
};

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {
    openDelivery: (state, action) => {
      state.deliveryOpened = action.payload;
    },
    openAssignOrder: (state, action) => {
      state.assignOrderOpened = action.payload;
    },
    assignOrder: (state, action) => {
      state.deliveryDetails = action.payload;
    },
  },
});

export default orderSlice.reducer;
export const { openDelivery, openAssignOrder, assignOrder } =
  orderSlice.actions;

