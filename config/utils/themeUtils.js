// themeUtils.js
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";

const savedMode = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const mode = localStorage.getItem("theme");
    if (mode === darkTheme.id) {
      return darkTheme;
    } else if (mode === lightTheme.id) {
      return lightTheme;
    }
  } catch (error) {
    console.error("Failed to get theme from localStorage:", error);
  }
  return null;
};

const getCurrentTheme = () => {
  const prefersDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const defaultTheme =
    savedMode() || (prefersDarkMode ? darkTheme : lightTheme);
  return defaultTheme;
};

export { getCurrentTheme, savedMode };
