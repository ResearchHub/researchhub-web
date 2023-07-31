import React, { useEffect, useState } from "react";
import Toggle from "react-toggle";
import { useTheme } from "../contexts/ThemeContext";
import { css, StyleSheet } from "aphrodite";

const DarkModeToggle = () => {
  const [checked, setChecked] = useState(false);
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    console.log("theme changes: ", theme.id);
    setChecked(theme.id === "dark");
  }, [theme]);

  return (
    <div className={css(styles.checkboxEntry)}>
      <div className={css(styles.checkboxLabel)} id={"checkbox-label"}>
        {"Dark Mode"}
      </div>
      <Toggle
        key={theme?.id}
        className={"react-toggle"}
        checked={checked}
        id={theme?.id}
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
    borderTop: `1px solid ${colors.LIGHT_GREY_BACKGROUND}`,
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
