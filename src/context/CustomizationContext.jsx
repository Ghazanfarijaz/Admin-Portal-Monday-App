// CustomizationContext.js
import { useForm } from "@mantine/form";
import React, { createContext, useContext } from "react";

// 1. Create the context
const CustomizationContext = createContext();

// 2. Create provider
export const CustomizationProvider = ({ children }) => {
  const customizationForm = useForm({
    initialValues: {
      selectedBoards: [],
      description: "",
      logo: null,
      allowNewValueCreation: false,
      filterItemsByEmail: false,
      allowUsersToCreateNewItems: false,
      signUpMethod: "no-signup-allowed",
    },
    validate: {
      selectedBoards: (value) =>
        value.length < 1
          ? "At least one board is required!"
          : value.every((board) => board.id !== "")
          ? null
          : "All boards must have value!",
      description: (value) =>
        value.length < 10
          ? "Description must be at least 10 characters long!"
          : null,

      logo: (value) => (value ? null : "Logo is required!"),
    },
  });

  const [shouldPopuplateInitialData, setShouldPopuplateInitialData] =
    React.useState(true);

  return (
    <CustomizationContext.Provider
      value={{
        customizationForm,
        shouldPopuplateInitialData,
        setShouldPopuplateInitialData,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

// 3. Custom hook for easy usage
export const useCustomization = () => {
  return useContext(CustomizationContext);
};
