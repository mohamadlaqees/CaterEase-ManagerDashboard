import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantName: "",
  restaurantAddress: "",
  restaurantPhoto: "",
  restaurantPhone: "",
  restaurantDeliveryRegions: [],
  restaurantCategories: [],
  restaurantManagerName: "",
  restaurantWorkingDays: [],
};

const restaurantSlice = createSlice({
  name: "restaurantSlice",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.restaurantName = action.payload;
    },
    setPhoto: (state, action) => {
      state.restaurantPhoto = action.payload;
    },
    setAddress: (state, action) => {
      state.restaurantAddress = action.payload;
    },
    setPhone: (state, action) => {
      state.restaurantPhone = action.payload;
    },
    setDeliveryRegions: (state, action) => {
      state.restaurantDeliveryRegions = action.payload;
    },
    setCategories: (state, action) => {
      state.restaurantCategories = action.payload;
    },
    setManagerName: (state, action) => {
      state.restaurantManagerName = action.payload;
    },
    setWorkingDays: (state, action) => {
      state.restaurantWorkingDays = action.payload;
    },
  },
});

export default restaurantSlice.reducer;
export const {
  setName,
  setPhoto,
  setAddress,
  setCategories,
  setDeliveryRegions,
  setManagerName,
  setPhone,
  setWorkingDays,
} = restaurantSlice.actions;
