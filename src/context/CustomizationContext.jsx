// CustomizationContext.js
import { createContext, useContext, useState } from "react";

// 1. Create the context
const CustomizationContext = createContext();

// 2. Create provider
export const CustomizationProvider = ({ children }) => {
  const [customizationData, setCustomizationData] = useState({
    selectedBoards: [],
    description: "",
    logo: null,
    allowNewValueCreation: false,
    filterItemsByEmail: false,
    // selectedEmailColumn: {
    //   id: "",
    //   title: "",
    // },
    allowUsersToCreateNewItems: false,
    signUpMethod: "no-signup-allowed",
  });

  return (
    <CustomizationContext.Provider
      value={{ customizationData, setCustomizationData }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

// 3. Custom hook for easy usage
export const useCustomization = () => {
  return useContext(CustomizationContext);
};
