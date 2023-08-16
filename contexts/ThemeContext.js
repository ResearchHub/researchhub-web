import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentTheme } from "../config/utils/themeUtils";
import { getColors, setColorTheme } from "../config/themes/colors";
import lightTheme from "../config/themes/light";
import darkTheme from "../config/themes/dark";

const ThemeContext = createContext({
  theme: lightTheme,
  setTheme: (theme) => {
    console.warn(
      "setTheme is not implemented. Please make sure that you are using ThemeProvider."
    );
  },
  toggleTheme: () => {
    console.warn(
      "toggleTheme is not implemented. Please make sure that you are using ThemeProvider."
    );
  },
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(undefined);

  useEffect(() => {
    const defaultTheme = getCurrentTheme();
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
    try {
      if (theme.id === lightTheme.id) {
        localStorage.setItem("theme", darkTheme.id);
        setTheme(darkTheme);
      } else {
        localStorage.setItem("theme", lightTheme.id);
        setTheme(lightTheme);
      }
    } catch (error) {
      console.error("Failed to set theme in localStorage:", error);
    }
    const newTheme =
      getColors().id === lightTheme.id ? darkTheme.id : lightTheme.id;
    setColorTheme(newTheme);

    updateManifestLink();
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
