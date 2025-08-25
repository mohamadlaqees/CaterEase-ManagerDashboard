import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setEarnings } from "../dashboardSlice";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
    prepareHeaders: (header) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        header.set("Authorization", `Bearer ${token}`);
      }
      header.set("Accept", "application/json");
      return header;
    },
  }),
  tagTypes: [
    "Delivery",
    "category",
    "updatePackage",
    "discount",
    "updateDelivery",
    "order",
    "allDelivery",
    "promo",
  ],
  endpoints: (build) => ({
    // Auth
    logIn: build.mutation({
      query: (userInfo) => ({
        url: "login",
        method: "POST",
        body: {
          ...userInfo,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.access_token) {
            localStorage.setItem("authToken", data.access_token);
            dispatch(apiSlice.endpoints.branchInfo.initiate());
          }
        } catch (error) {
          console.error("Login onQueryStarted error:", error);
        }
      },
    }),
    logOut: build.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("authToken");
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          console.error("Logout failed:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("branchID");
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),

    // Dashboard
    earnings: build.query({
      query: (branchID) => `earnings/${branchID}`,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setEarnings(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    ordersStatus: build.query({
      query: (branchID) => `orders/${branchID}/numberallstatus`,
    }),
    popularFood: build.query({
      query: (branchID) =>
        `orders/statistics/popular-food-categories/${branchID}`,
    }),
    monthlyOrders: build.query({
      query: (branchID) => `orders/${branchID}/monthly-stats`,
    }),
    deliveredOrdersStatus: build.query({
      query: (branchID) => `orders/delivered-category-stats/${branchID}`,
    }),
    ordersActivity: build.query({
      query: (branchID) => `orders/${branchID}/everymonth`,
    }),
    latestOrders: build.query({
      query: () => `Orders/manange/latestDeliveredOrders`,
    }),

    // Profile
    branchInfo: build.query({
      query: () => "mybranch",

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          if (data && data.branch) {
            localStorage.setItem("branchID", data.branch.id);
            dispatch(
              apiSlice.endpoints.earnings.initiate(
                data.branch.original.branch.id
              )
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    workingDays: build.query({
      query: (branchID) => `branches/${branchID}/working-days`,
    }),

    // menu
    categories: build.query({
      query: () => "branches/categories",
    }),
    packages: build.query({
      query: (categoryID) => `packages_to_category/?category_id=${categoryID}`,
      providesTags: ["category"],
    }),
    packagesWithDiscount: build.query({
      query: () => `package-discounts/management`,
      providesTags: ["discount"],
    }),
    popularThisWeek: build.query({
      query: (branchID) => `orders/Popular-food-week/${branchID}`,
    }),
    bestSeller: build.query({
      query: (branchID) => `orders/best-sell/${branchID}`,
    }),
    promo: build.query({
      query: () => `package-discounts/management`,
      providesTags: ["promo"],
    }),
    addpackage: build.mutation({
      query: (packageInfo) => ({
        url: `packagesmangement`,
        method: "POST",
        body: {
          ...packageInfo,
        },
      }),
      invalidatesTags: ["category"],
    }),
    deletepackage: build.mutation({
      query: (packageID) => ({
        url: `packagesmangement/${packageID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
    getPackage: build.query({
      query: (pacakgeID) => `packagesmangement/${pacakgeID}`,
      providesTags: ["updatePackage"],
    }),
    updatepackage: build.mutation({
      query: (updatedPackage) => ({
        url: `packagesmangement/${updatedPackage.id}`,
        method: "PUT",
        body: {
          ...updatedPackage,
        },
      }),
      invalidatesTags: ["updatePackage"],
    }),
    getOccasion: build.query({
      query: () => "occasion-types",
    }),
    addDiscount: build.mutation({
      query: (discount) => ({
        url: "package-discounts/management",
        method: "POST",
        body: {
          ...discount,
        },
      }),
      invalidatesTags: ["discount", "updatePackage", "category", "promo"],
    }),
    deleteDiscount: build.mutation({
      query: (discountID) => ({
        url: `package-discounts/${discountID}/management`,
        method: "DELETE",
      }),
      invalidatesTags: ["discount", "updatePackage", "category", "promo"],
    }),
    branchServices: build.query({
      query: () => `ServiceType/manange/branch`,
    }),

    // Customers
    customers: build.query({
      query: ({ branchID, search, date, status }) => {
        const params = new URLSearchParams();
        if (search) params.append("name", search);
        if (date) params.append("date", date);
        if (status) params.append("status", status);

        return `${
          (search === undefined &&
            date === undefined &&
            status === undefined) ||
          status === "all"
            ? `all_customer/${branchID}`
            : `branches/${branchID}/customers/${
                search ? "search" : date ? "verified" : status ? "status" : ""
              }?${params.toString()}`
        }`;
      },
    }),
    customerDetails: build.query({
      query: (customerID) => `branches/${customerID}/customer`,
    }),
    customerOrders: build.query({
      query: ({ customerID, orderStatus }) => {
        return `manager/customers/${customerID}/orders/${orderStatus}`;
      },
    }),
    coupon: build.mutation({
      query: (coupon) => ({
        url: "coupons/create",
        method: "POST",
        body: {
          ...coupon,
        },
      }),
    }),

    // Delivery
    delivery: build.query({
      query: ({ search, date, status }) => {
        const params = new URLSearchParams();
        if (search) params.append("name", search);
        if (date) params.append("date", date);
        if (status) params.append("status", status);

        return `${
          search === undefined &&
          date === undefined &&
          (status === undefined || status === "all")
            ? `delivery-people/manage`
            : `delivery/manage?${params.toString()}`
        }`;
      },
      providesTags: ["Delivery"],
    }),
    addDeliveryEmployee: build.mutation({
      query: (DEInfo) => ({
        url: "delivery-people/manage",
        method: "POST",
        body: {
          ...DEInfo,
        },
      }),
      invalidatesTags: ["Delivery"],
    }),
    deliveryDetails: build.query({
      query: (deliveryID) => ({
        url: `delivery-people/manage/${deliveryID}`,
      }),
      providesTags: ["updateDelivery"],
    }),
    deleteDeliveryEmployee: build.mutation({
      query: (deliveryID) => ({
        url: `delivery-people/manage/${deliveryID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Delivery"],
    }),
    deliveryOrders: build.query({
      query: (deliveryID) => `manager/delivery-person/${deliveryID}/orders`,
    }),
    editDeliveryEmployee: build.mutation({
      query: ({ deliveryEmployee, payload }) => ({
        url: `delivery-people/manage/${deliveryEmployee}`,
        method: "PUT",
        body: {
          ...payload,
        },
      }),
      invalidatesTags: ["updateDelivery"],
    }),
    filterDeliveryOrders: build.query({
      query: (status) => `manager/delivery-person/1/orders?status=${status}`,
    }),

    //Orders
    orderHistory: build.query({
      query: () => `order/manange/allorder`,
    }),
    orderStatusSearch: build.query({
      query: (status) => `order/manange/${status}/status`,
    }),
    orderStatistics: build.query({
      query: () => "order/manange/getStatistics",
    }),
    onGoingOrders: build.query({
      query: () => "Orders/manange/allStates",
    }),
    order: build.query({
      query: (orderID) => `order/manange/${orderID}/show`,
      providesTags: ["order"],
    }),
    orderDateSearch: build.query({
      query: (date) => `order/manange/data?date=${date}`,
    }),
    acceptOrder: build.mutation({
      query: (orderID) => ({
        url: `order/manange/${orderID}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["order"],
    }),
    rejectOrder: build.mutation({
      query: ({ orderID, data }) => ({
        url: `order/manange/${orderID}/reject`,
        method: "POST",
        body: {
          ...data,
        },
      }),
      invalidatesTags: ["order"],
    }),
    allDeliveryEmp: build.query({
      query: () => "delivery/manage",
      providesTags: ["allDelivery"],
    }),
    assignOrder: build.mutation({
      query: (data) => ({
        url: "order/manange/assignDelivery",
        method: "POST",
        body: {
          ...data,
        },
      }),
      invalidatesTags: ["allDelivery"],
    }),

    //Report
    report: build.mutation({
      query: (report) => ({
        url: "/report",
        method: "POST",
        body: {
          ...report,
        },
      }),
    }),

    //reviews
    reviews: build.query({
      query: () => "reviews/manage",
    }),
    deliveryReviews: build.query({
      query: () => "reviews/manage/DeliveryReviews",
    }),
    reviewsDateFilter: build.query({
      query: (date) => `reviews/manage?date=${date}`,
    }),
    deliveryReviewsDateFilter: build.query({
      query: (date) => `reviews/manage/DeliveryReviews?date=${date}`,
    }),
  }),
});

export const {
  useLogInMutation,
  useLogOutMutation,
  useBranchInfoQuery,
  useEarningsQuery,
  useOrdersStatusQuery,
  usePopularFoodQuery,
  useMonthlyOrdersQuery,
  useDeliveredOrdersStatusQuery,
  useOrdersActivityQuery,
  useWorkingDaysQuery,
  useCategoriesQuery,
  usePackagesQuery,
  useCustomersQuery,
  useReportMutation,
  usePopularThisWeekQuery,
  useBestSellerQuery,
  usePromoQuery,
  useCouponMutation,
  useDeliveryQuery,
  useCustomerDetailsQuery,
  useCustomerOrdersQuery,
  useAddDeliveryEmployeeMutation,
  useDeliveryDetailsQuery,
  useDeleteDeliveryEmployeeMutation,
  useAddpackageMutation,
  useGetPackageQuery,
  useGetOccasionQuery,
  useDeletepackageMutation,
  useAddDiscountMutation,
  useUpdatepackageMutation,
  useDeleteDiscountMutation,
  usePackagesWithDiscountQuery,
  useReviewsQuery,
  useDeliveryOrdersQuery,
  useEditDeliveryEmployeeMutation,
  useBranchServicesQuery,
  useOrderHistoryQuery,
  useOrderStatusSearchQuery,
  useOrderStatisticsQuery,
  useReviewsDateFilterQuery,
  useDeliveryReviewsQuery,
  useLatestOrdersQuery,
  useFilterDeliveryOrdersQuery,
  useDeliveryReviewsDateFilterQuery,
  useOnGoingOrdersQuery,
  useOrderQuery,
  useOrderDateSearchQuery,
  useAcceptOrderMutation,
  useRejectOrderMutation,
  useAllDeliveryEmpQuery,
  useAssignOrderMutation,
} = apiSlice;
