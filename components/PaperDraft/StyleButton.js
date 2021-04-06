import { StyleSheet, css } from "aphrodite";
import React from "react";

const StyleButton = (props) => {
  const { isStyleActive, label, onClick } = props;
  return (
    <span
      className={css([styles.button, isStyleActive && styles.active])}
      onClick={onClick}
    >
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
