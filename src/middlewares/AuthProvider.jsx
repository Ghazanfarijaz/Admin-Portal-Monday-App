import { useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";

// Monday SDK initialization
const monday = mondaySdk();

const AuthProvider = ({ children }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["monday-slug"],
    queryFn: async () => {
      try {
        const query = `query {
                            account{
                                slug
                            }
                        }`;

        const response = await monday.api(query);

        return response.data.account.slug;
      } catch (error) {
        console.error("Error fetching account slug:", error);
        throw new Error("Authentication Failed!");
      }
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message || "Authentication Failed!"}</div>;
  }

  console.log("Account slug:", data);

  return <>{children}</>;
};

export default AuthProvider;
