import { createContext, useContext, useState } from "react";
const ModalContext = createContext();
export const ModalProvider = ({ children }) => {
    const [uploadUserModal, setUploadUserModal] = useState(false);
    return (
        <ModalContext.Provider value={{ uploadUserModal, setUploadUserModal }}>
            {children}
        </ModalContext.Provider>
    );
};
export const useModal = () => useContext(ModalContext);