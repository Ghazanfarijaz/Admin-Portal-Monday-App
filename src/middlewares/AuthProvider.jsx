import { useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";
import { authAPIs } from "../api/auth";

// Monday SDK initialization
const monday = mondaySdk();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const AuthProvider = ({ children }) => {
  const { isPending, isError, error } = useQuery({
    queryKey: ["monday-slug"],
    queryFn: async () => {
      try {
        const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });

        const authResponse = await authAPIs.checkUserAuth({ slug: userSlug });

        if (authResponse?.action === "do_oauth") {
          // Redirect the user to the auth URL, this will unload the app, but they will be redirected back
          // when auth is complete.
          console.log("Redirecting to auth", authResponse.authUrl);
          window.location = authResponse.authUrl;
          // Don't return, we're redirecting. If we return, the app has to handle a load of extra
          // logic to not try and deal with this "error" class.
          while (true) {
            await delay(3000);
            console.log("Waiting for auth redirect, still...");
          }
        }

        return authResponse;
      } catch (error) {
        console.error("Error Authenticating User: ", error);
        throw new Error("Authentication Failed!");
      }
    },
  });

  if (isPending) {
    return (
      <div className="text-white h-screen w-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return <div>{error.message || "Authentication Failed!"}</div>;
  }

  return <>{children}</>;
};

export default AuthProvider;
