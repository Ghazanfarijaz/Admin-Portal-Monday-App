import { useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";
import { authAPIs } from "../api/auth";
import { AttentionBox } from "@vibe/core";
import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";

// Monday SDK initialization
const monday = mondaySdk();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const AuthProvider = ({ children }) => {
  // Session Token
  const [sessionToken, setSessionToken] = useState(null);

  const { isPending, isError, error } = useQuery({
    queryKey: ["monday-slug", sessionToken],
    queryFn: async () => {
      try {
        const authResponse = await authAPIs.checkUserAuth({
          sessionToken,
        });

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
    enabled: !!sessionToken,
  });

  useEffect(() => {
    monday.listen("sessionToken", ({ data: token }) => {
      setSessionToken(token);
    });
  }, []);

  if (isPending) {
    return (
      <div className="text-white h-screen w-screen flex justify-center items-center">
        <Loader color="#007F9B" size="md" type="bars" />
      </div>
    );
  }

  if (isError) {
    console.error("Authentication Failed!", error);
    return (
      <div className="flex justify-center mt-4">
        <AttentionBox
          title="Authentication Failed!"
          text={error?.message || "Something went wrong"}
          type="danger"
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
