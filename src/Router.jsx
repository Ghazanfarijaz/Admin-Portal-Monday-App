import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "./middlewares/AuthProvider";
import {ModalProvider} from "./context/ModalContext";
import App from "./App";
import DashboardLayout from "./layouts/DashboardLayout";
import AddNewUser from "./pages/add-user/AddNewUser";
import AddCustomization from "./pages/add-customization/AddCustomization";
import EditCustomization from "./pages/edit-customization/EditCustomization";
import UsersList from "./Components/UserListUpload/UsersList";
import Configuration from "./Components/Configuration";

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
        element: (
          <ModalProvider>
            <DashboardLayout />
          </ModalProvider>
        ),
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
