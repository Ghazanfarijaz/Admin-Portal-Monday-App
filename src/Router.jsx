import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "./middlewares/AuthProvider";
import App from "./App";
import Dashboard from "./pages/dashboard/Dashboard";
import AddNewUser from "./pages/add-user/AddNewUser";
import AddCustomization from "./pages/add-customization/AddCustomization";
import EditCustomization from "./pages/edit-customization/EditCustomization";

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
        element: <Dashboard />,
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
