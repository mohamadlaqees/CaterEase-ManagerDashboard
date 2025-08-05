import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Layout from "./layout/Layout.jsx";
import Menu from "./pages/Menu.jsx";
import Customers from "./pages/Customers.jsx";
import Orders from "./pages/Orders.jsx";
import Delivery from "./pages/Delivery.jsx";
import Reviews from "./pages/Reviews.jsx";
import SendReports from "./pages/SendReports.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import Profile from "./pages/Profile.jsx";
import AddFood from "./pages/AddFood.jsx";
import Category from "./pages/Category.jsx";
import FoodDetails from "./pages/FoodDetails.jsx";
import EditFood from "./pages/EditFood.jsx";
import CustomerDetails from "./pages/CustomerDetails.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import AddDeliveryEmployee from "./pages/AddDeliveryEmployee.jsx";
import DeliveryEmployeeDetails from "./pages/DeliveryEmployeeDetails.jsx";
import DeliveryEmployeeReviews from "./pages/DeliveryEmployeeReviews.jsx";
import EditDeliveryEmployee from "./pages/EditDeliveryEmployee.jsx";
import ProtectRoute from "./components/protectRoute.jsx";

const routes = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectRoute>
        <Layout />
      </ProtectRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "menu",
        element: <Menu />,
      },
      {
        path: "menu/add-food",
        element: <AddFood />,
      },
      {
        path: "menu/:category",
        element: <Category />,
      },
      {
        path: "menu/:category/:food",
        element: <FoodDetails />,
      },
      {
        path: "orders/:id/:food",
        element: <FoodDetails />,
      },
      {
        path: "menu/:category/edit-food/:food",
        element: <EditFood />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "customers/:name",
        element: <CustomerDetails />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "orders/:orderID",
        element: <OrderDetails />,
      },
      {
        path: "customers/:customerName/:name",
        element: <OrderDetails />,
      },
      {
        path: "delivery",
        element: <Delivery />,
        children: [
          {
            index: true,
            element: <Delivery />,
          },
          {
            path: "add-delivery-employee",
            element: <AddDeliveryEmployee />,
          },
        ],
      },
      {
        path: "delivery/:deliveryEmployee",
        element: <DeliveryEmployeeDetails />,
        children: [
          {
            index: true,
            element: <DeliveryEmployeeDetails />,
          },
          {
            path: "edit-delivery-employee",
            element: <EditDeliveryEmployee />,
          },
        ],
      },
      {
        path: "reviews",
        element: <Reviews />,
        children: [
          {
            index: true,
            element: <Reviews />,
          },
          {
            path: "delivery-employee-reviews",
            element: <DeliveryEmployeeReviews />,
          },
        ],
      },
      {
        path: "sendReports",
        element: <SendReports />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
);
