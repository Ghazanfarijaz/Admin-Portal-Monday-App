import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "./middlewares/AuthProvider";
import App from "./App";
import DashboardLayout from "./layouts/DashboardLayout";
import AddNewUser from "./pages/add-user/AddNewUser";
import AddCustomization from "./pages/add-customization/AddCustomization";
import EditCustomization from "./pages/edit-customization/EditCustomization";
import UsersList from "./pages/users-list/UsersList";
import Configuration from "./pages/view-configuration/Configuration";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <UsersList />,
          },
          {
            path: "configuration",
            element: <Configuration />,
          },
        ],
      },
      {
        path: "add-new-user",
        element: <AddNewUser />,
      },
      {
        path: "add-customization",
        element: <AddCustomization />,
      },
      {
        path: "edit-customization",
        element: <EditCustomization />,
      },
    ],
  },
]);
