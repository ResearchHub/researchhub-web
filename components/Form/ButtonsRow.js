import React from "react";
import { StyleSheet, css } from "aphrodite";

import Button from "../Form/Button";

import colors from "~/config/themes/colors";

const ButtonsRow = (props) => {
  const { left, right, farRight } = props;

  return (
    <div className={css(styles.buttonContainer)}>
      <div
        className={css(styles.button, styles.buttonLeft)}
        onClick={left.onClick && left.onClick}
      >
        <span className={css(styles.buttonLabel)}>
          {left.label && left.label}
        </span>
      </div>
      <Button
        label={right.label && right.label}
        customButtonStyle={styles.button}
        disabled={right.disabled && right.disabled}
        onClick={right.onClick && right.onClick}
      />
      {farRight && (
        <div
          className={css(styles.button, styles.buttonLeft)}
          onClick={farRight.onClick && farRight.onClick}
        >
          <span className={css(styles.buttonLabel)}>
            {farRight.label && farRight.label}
          </span>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    width: 180,
    height: 55,
    "@media only screen and (max-width: 551px)": {
      width: 160,
    },
    "@media only screen and (max-width: 415px)": {
      width: 130,
    },
  },
  buttonLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  buttonLabel: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

export default ButtonsRow;
