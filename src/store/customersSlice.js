import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  couponOpened: false,
  couponsListOpened: false,
};

const customersSlice = createSlice({
  name: "customersSlice",
  initialState,
  reducers: {
    openCoupon: (state, action) => {
      state.couponOpened = action.payload;
    },
    openCouponsList: (state, action) => {
      state.couponsListOpened = action.payload;
    },
  },
});

export default customersSlice.reducer;
export const { openCoupon, openCouponsList } = customersSlice.actions;
