import "./init";
import { createRoot } from "react-dom/client";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

// Mantine
import { createTheme, MantineProvider } from "@mantine/core";

// Mantine Styles
import "@mantine/core/styles.css";

// Importing the router
import { router } from "./Router.jsx";
import { RouterProvider } from "react-router-dom";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const theme = createTheme({
  cursorType: "pointer",
});

const root = createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    {/* Router Provider */}
    <MantineProvider theme={theme}>
    <RouterProvider router={router} />
    </MantineProvider>
  </QueryClientProvider>
);

serviceWorker.unregister();
