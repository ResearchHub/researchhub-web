import React, { createContext, useContext, useEffect, useState } from "react";
import lightTheme from "../config/themes/light";
import darkTheme from "../config/themes/dark";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(undefined);

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const defaultTheme =
      savedMode || (prefersDarkMode ? darkTheme : lightTheme);
    setTheme(defaultTheme);
  }, []);

  const toggleTheme = () => {
    console.log("toggle theme. Theme: ", theme);
    if (theme.id === lightTheme.id) {
      localStorage.setItem("theme", "dark");
      setTheme(darkTheme);
      console.log("set dark theme");
    } else {
      localStorage.setItem("theme", "light");
      setTheme(lightTheme);
      console.log("set light theme");
    }
  };

  const savedMode = () => {
    const mode = localStorage.getItem("theme");
    if (mode === "dark") {
      return darkTheme;
    } else if (mode === "light") {
      return lightTheme;
    }
    return 0;
  };

  if (theme === undefined) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
