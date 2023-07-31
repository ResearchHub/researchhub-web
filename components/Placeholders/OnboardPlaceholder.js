import { useState } from "react";
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
            <TextRow
              className={css(styles.title)}
              color={colors.PLACEHOLDER_CARD_BACKGROUND}
            />
            <RoundShape
              className={css(styles.button)}
              color={colors.PLACEHOLDER_CARD_BACKGROUND}
            />
          </div>
          <RectShape
            className={css(styles.image)}
            color={colors.PLACEHOLDER_CARD_BACKGROUND}
          />
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
    border: `1px solid ${colors.LIGHT_GREY_BACKGROUND}`,
    borderRadius: 3,
    background: colors.WHITE(),
    boxSizing: "border-box",
    cursor: "pointer",
    marginRight: 10,
    marginBottom: 10,
    ":hover": {
      border: "1px solid #C4C4C4",
      filter: `drop-shadow(0px 4px 4px ${colors.PURE_BLACK(0.25)}))`,
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
    // color: colors.TEXT_DARKER_GREY,
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
    background: colors.BLACK(0.03),
    color: colors.BLACK(0.5),
    border: `1px solid ${colors.BLACK(0.1)}`,
    boxSizing: "border-box",
  },
  active: {
    background: colors.WHITE(),
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
