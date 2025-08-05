import { configureStore } from "@reduxjs/toolkit";
import sidebarSlice from "./sidebarSlice";
import menuSlice from "./menuSlice";
import customersSlice from "./customersSlice";
import orderSlice from "./orderSlice";
import deliverySlice from "./deliverySlice";
import dashboardSlice from "./dashboardSlice";
import restaurantSlice from "./restaurantSlice";
import packageSlice from "./packageSlice";
import { apiSlice } from "./apiSlice/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice,
    menu: menuSlice,
    customers: customersSlice,
    order: orderSlice,
    delivery: deliverySlice,
    dash: dashboardSlice,
    restaurant: restaurantSlice,
    package: packageSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
setupListeners(store.dispatch);

export default store;
