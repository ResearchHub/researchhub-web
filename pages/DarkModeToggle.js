import React from "react";
import Toggle from "react-toggle";
import { useTheme } from "../contexts/ThemeContext";
import { css, StyleSheet } from "aphrodite";

const DarkModeToggle = () => {
  const { theme, toggleTheme, darkTheme } = useTheme();

  return (
    <div className={css(styles.checkboxEntry)}>
      <div className={css(styles.checkboxLabel)} id={"checkbox-label"}>
        {"Dark Mode"}
      </div>
      <Toggle
        key={"prefersDarkModeOn"}
        className={"react-toggle"}
        checked={theme === darkTheme}
        id={"prefersDarkModeOn"}
        onChange={toggleTheme}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  checkboxEntry: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderTop: "1px solid #EDEDED",
    fontWeight: 300,
    ":hover": {
      fontWeight: 500,
    },
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default DarkModeToggle;
