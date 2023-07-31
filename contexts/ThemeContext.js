import React, { createContext, useContext, useEffect, useState } from "react";
import lightTheme from "../config/themes/light";
import darkTheme from "../config/themes/dark";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const defaultTheme =
    localStorage.getItem("theme") || (prefersDarkMode ? darkTheme : lightTheme);
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setTheme(mediaQuery.matches ? darkTheme : lightTheme);
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
