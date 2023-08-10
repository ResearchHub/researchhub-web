import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { css, StyleSheet } from "aphrodite";
import colors from "../config/themes/colors";
import darkTheme from "../config/themes/dark";
import { useRouter } from "next/router";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

const DarkModeToggle = () => {
  const router = useRouter();
  const [inDarkMode, setInDarkMode] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    setInDarkMode(theme.id === darkTheme.id);
  }, [theme]);

  return (
    <div className={css(styles.ColorModeButton)}>
      <button
        className={css(styles.toggleButton)}
        aria-label="Toggle Dark Mode"
        disabled={!enabled}
        onClick={() => {
          setEnabled(false);
          toggleTheme();
          router.reload();
        }}
      >
        {inDarkMode ? <IoSunnyOutline /> : <IoMoonOutline />}
      </button>
    </div>
  );
};

const styles = StyleSheet.create({
  ColorModeButton: {
    padding: "10px 0",
  },
  toggleButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "22px",
    color: colors.DARK_GREY(),
    ":hover": {
      color: colors.PURE_BLACK(),
      transform: "scale(1.1)",
    },
    paddingTop: "8px",
  },
});

export default DarkModeToggle;
