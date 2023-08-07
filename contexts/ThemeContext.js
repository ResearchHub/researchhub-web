import React, { createContext, useContext, useEffect, useState } from "react";
import lightTheme from "../config/themes/light";
import darkTheme from "../config/themes/dark";
import { getColors, setColorTheme } from "../config/themes/colors";

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

  useEffect(() => {
    updateManifestLink();
  }, [theme]);

  const updateManifestLink = () => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.href =
        theme?.id === darkTheme.id
          ? "/static/favicons/site-dark.webmanifest"
          : "/static/favicons/site.webmanifest";
    }
  };
  const toggleTheme = () => {
    if (theme.id === lightTheme.id) {
      localStorage.setItem("theme", "dark");
      setTheme(darkTheme);
    } else {
      localStorage.setItem("theme", "light");
      setTheme(lightTheme);
    }
    const newTheme = getColors().id === "light" ? "dark" : "light";
    setColorTheme(newTheme);

    updateManifestLink();
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
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
