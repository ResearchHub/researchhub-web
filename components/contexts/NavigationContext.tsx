import { createContext, useContext, useEffect, useState } from "react";
import { breakpoints } from "~/config/themes/screen";

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

  useEffect(() => {
    if (window.innerWidth >= breakpoints.large.int) {
      setIsRefManagerSidebarOpen(true);
    }
  }, []);

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
