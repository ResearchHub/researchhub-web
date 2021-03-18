import React from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const StyleButton = (props) => {
  const { onClick, label, active, style } = props;

  const onToggle = (e) => {
    e.preventDefault();
    onClick(style);
  };

  const className = [styles.button, active && styles.active];

  return (
    <span className={css(className)} onClick={onToggle}>
      {label}
    </span>
  );
};

const styles = StyleSheet.create({
  button: {
    color: "#999",
    cursor: "pointer",
    marginRight: 16,
    padding: "2px 0",
    display: "inline-block",
  },
  active: {
    color: "#5890ff",
  },
});

export default StyleButton;
