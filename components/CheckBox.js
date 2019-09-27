import React from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "../config/themes/colors";

const CheckBox = ({ id, active, label, onClick }) => {
  return (
    <div className={css(styles.checkboxContainer)}>
      <div
        className={css(styles.checkBox, active && styles.active)}
        onClick={() => onClick && onClick(id)}
      >
        <div className={css(styles.dot)} />
      </div>
      <p className={css(styles.label)}>{label && label}</p>
    </div>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 24,
    width: 87,
  },
  checkBox: {
    height: 23,
    width: 23,
    borderRadius: "50%",
    border: "1px solid #e8e8f1",
    cursor: "pointer",
    position: "relative",
    backgroundColor: "#FBFBFD",
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: "50%",
    backgroundColor: "#FBFBFD",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-53%, -44.5%)",
  },
  active: {
    backgroundColor: colors.BLUE(1),
    border: `1px solid ${colors.BLUE(1)}`,
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 16,
    margin: 0,
    padding: 0,
  },
});

export default CheckBox;
