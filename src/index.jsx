import "./init";
import { createRoot } from "react-dom/client";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

// Importing the router
import { router } from "./Router.jsx";
import { RouterProvider } from "react-router-dom";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    {/* Router Provider */}
    <RouterProvider router={router} />
  </QueryClientProvider>
);

serviceWorker.unregister();
