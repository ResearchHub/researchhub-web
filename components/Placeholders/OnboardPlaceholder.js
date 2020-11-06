import React, { usEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";

import {
  RectShape,
  TextRow,
  RoundShape,
} from "react-placeholder/lib/placeholders";

import colors from "~/config/themes/colors";

const OnboardPlaceholder = (props) => {
  const [placeholders, setPlaceholders] = useState(_formatPlaceholders());

  function _formatPlaceholders() {
    let arr = [];
    for (let i = 0; i < 9; i++) {
      arr.push(
        <div className={css(styles.card) + " show-loading-animation"}>
          <div className={css(styles.header)}>
            <TextRow className={css(styles.title)} color={"#EFEFEF"} />
            <RoundShape className={css(styles.button)} color={"#EFEFEF"} />
          </div>
          <RectShape className={css(styles.image)} color={"#EFEFEF"} />
        </div>
      );
    }
    return arr;
  }

  return <div className={css(styles.container)}>{placeholders}</div>;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    maxWidth: 700,
    width: "100%",
    flexWrap: "wrap",
    "@media only screen and (max-width: 936px)": {
      justifyContent: "center",
    },
  },
  card: {
    width: 220,
    border: "1px solid #EDEDED",
    borderRadius: 3,
    background: "#FFFFFF",
    boxSizing: "border-box",
    cursor: "pointer",
    marginRight: 10,
    marginBottom: 10,
    ":hover": {
      border: "1px solid #C4C4C4",
      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 15,
    boxSizing: "border-box",
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
    width: "80%",
    // color: "#241F3A",
    textTransform: "capitalize",
    // paddingRight: 10,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 25,
    width: 25,
    borderRadius: "50%",
    background: "rgba(36, 31, 58, 0.03)",
    color: "rgba(36, 31, 58, 0.5)",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    boxSizing: "border-box",
  },
  active: {
    background: "#FFFFFF",
    color: colors.BLUE(),
    // borderColor: colors.BLUE()
  },
  image: {
    minHeight: 130,
    height: 130,
    maxHeight: 130,
    width: "100%",
    objectFit: "cover",
    userSelect: "none",
  },
});

export default OnboardPlaceholder;
