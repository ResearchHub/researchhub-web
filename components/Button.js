import React from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "../config/themes/colors";

const Button = ({
  label,
  isWhite,
  size,
  disabled,
  customButtonStyle,
  customLabelStyle,
  onClick,
}) => {
  // size is a enum; type string: ['small', 'med', 'big']
  return (
    <button
      className={css(
        styles.button,
        isWhite && styles.isWhite,
        size && styles[size],
        customButtonStyle && customButtonStyle,
        disabled && styles.disabled
      )}
      onClick={onClick ? onClick : null}
    >
      <div
        className={css(
          styles.label,
          isWhite && styles.isWhiteLabel,
          customLabelStyle && customLabelStyle
        )}
      >
        {label && label}
      </div>
    </button>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 126,
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.BLUE(1),
    borderRadius: 5,
    cursor: "pointer",
    highlight: "none",
    outline: "none",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  isWhite: {
    backgroundColor: "#FFF",
    border: `1px solid ${colors.BLUE(1)}`,
    ":hover": {
      backgroundColor: colors.BLUE(1),
      color: "#FFF",
    },
  },
  isWhiteLabel: {
    color: colors.BLUE(1),
  },
  label: {
    color: "#FFF",
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 15,
  },
  small: {
    width: 126,
    height: 37,
  },
  med: {
    width: 126,
    height: 45,
  },
  big: {
    width: 160,
    height: 55,
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.4,
  },
});

export default Button;
