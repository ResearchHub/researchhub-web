import { createContext, useContext, useEffect, useState } from "react";

type NavContextType = {
  isRefManagerSidebarOpen: boolean;
  setIsRefManagerSidebarOpen: (isOpen: boolean) => void;
};

const NavigationContext = createContext<NavContextType>({
  isRefManagerSidebarOpen: false,
  setIsRefManagerSidebarOpen: (isOpen) => {
    throw new Error("setIsRefManagerSidebarOpen not implemented");
  },
});

export const navContext = () => useContext(NavigationContext);

export const NavigationContextProvider = ({ children }) => {
  const [isRefManagerSidebarOpen, setIsRefManagerSidebarOpen] = useState(false);

  useEffect(() => {}, []);

  return (
    <NavigationContext.Provider
      value={{
        isRefManagerSidebarOpen,
        setIsRefManagerSidebarOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
