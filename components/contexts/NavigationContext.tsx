import { createContext, useContext, useEffect, useState } from "react";
import useWindow from "~/config/hooks/useWindow";
import { breakpoints } from "~/config/themes/screen";

type NavContextType = {
  isRefManagerSidebarOpen: boolean;
  setIsRefManagerSidebarOpen: (isOpen: boolean) => void;
  isRefManagerDisplayedAsDrawer: boolean;
  setIsRefManagerDisplayedAsDrawer: (isDrawer: boolean) => void;
};

const NavigationContext = createContext<NavContextType>({
  isRefManagerSidebarOpen: false,
  setIsRefManagerSidebarOpen: (isOpen) => {
    throw new Error("setIsRefManagerSidebarOpen not implemented");
  },
  isRefManagerDisplayedAsDrawer: false,
  setIsRefManagerDisplayedAsDrawer: (isOpen) => {
    throw new Error("setIsRefManagerDisplayedAsDrawer not implemented");
  },
});

export const navContext = () => useContext(NavigationContext);

export const NavigationContextProvider = ({ children }) => {
  const [isRefManagerSidebarOpen, setIsRefManagerSidebarOpen] = useState(false);
  const [isRefManagerDisplayedAsDrawer, setIsRefManagerDisplayedAsDrawer] =
    useState(false);

  const { width: winWidth, height: winHeight } = useWindow();

  useEffect(() => {
    const displayAsDrawer = winWidth && winWidth < breakpoints.medium.int;

    if (displayAsDrawer && !isRefManagerDisplayedAsDrawer) {
      setIsRefManagerDisplayedAsDrawer(true);
    } else if (!displayAsDrawer && isRefManagerDisplayedAsDrawer) {
      setIsRefManagerDisplayedAsDrawer(false);
    }
  }, [winWidth]);

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
        isRefManagerDisplayedAsDrawer,
        setIsRefManagerDisplayedAsDrawer,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
