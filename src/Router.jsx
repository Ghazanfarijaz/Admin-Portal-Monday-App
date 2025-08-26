import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "./middlewares/AuthProvider";
import App from "./App";
import DashboardLayout from "./layouts/DashboardLayout";
import AddNewUser from "./pages/add-user/AddNewUser";
import UsersList from "./pages/users-list/UsersList";
import { CustomizationProvider } from "./context/CustomizationContext";
import EditConfiguration from "./pages/configuration/edit-configuration/EditConfiguration";
import AddConfiguration from "./pages/configuration/add-configuration/AddConfiguration";
import ViewConfiguration from "./pages/configuration/view-configuration/Configuration";
import BoardConfiguration from "./pages/configuration/board-configuration/BoardConfiguration";

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
            element: <ViewConfiguration />,
          },
        ],
      },
      {
        path: "add-new-user",
        element: <AddNewUser />,
      },
      {
        path: "add-configuration",
        element: (
          <CustomizationProvider>
            <AddConfiguration />
          </CustomizationProvider>
        ),
      },
      {
        path: "edit-configuration",
        element: (
          <CustomizationProvider>
            <EditConfiguration />
          </CustomizationProvider>
        ),
      },
      {
        path: "add-board-configuration/:boardId/:tempId",
        element: (
          <CustomizationProvider>
            <BoardConfiguration />
          </CustomizationProvider>
        ),
      },
    ],
  },
]);
