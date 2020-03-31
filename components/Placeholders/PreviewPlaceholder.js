import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import {
  TextBlock,
  MediaBlock,
  TextRow,
  RectShape,
  RoundShape,
} from "react-placeholder/lib/placeholders";

const PreviewPlaceholder = ({ color, hideAnimation }) => {
  var animate = " show-loading-animation";
  if (hideAnimation) {
    animate = " ";
  }

  return (
    <div className={css(styles.placeholderContainer) + animate}>
      <TextBlock
        className={css(styles.textRow)}
        rows={1}
        color={color}
        style={{ width: "100%" }}
      />
      <TextRow
        className={css(styles.textRow)}
        color={color}
        style={{ width: "70%" }}
      />
      <TextBlock
        className={css(styles.textRow)}
        rows={1}
        color={color}
        style={{ width: "100%" }}
      />
      <TextRow
        className={css(styles.textRow)}
        color={color}
        style={{ width: "70%" }}
      />
      <TextBlock
        className={css(styles.textRow)}
        rows={1}
        color={color}
        style={{ width: "100%" }}
      />
      <TextRow
        className={css(styles.textRow)}
        color={color}
        style={{ width: "70%" }}
      />
      <TextBlock
        className={css(styles.textRow)}
        rows={1}
        color={color}
        style={{ width: "100%" }}
      />
      <TextRow
        className={css(styles.textRow)}
        color={color}
        style={{ width: "70%" }}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    border: "1px solid rgb(237, 237, 237)",
    padding: "23px 15px",
    background: "#fff",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  textRow: {
    marginTop: 5,
  },
  space: {},
  label: {},
});

export default PreviewPlaceholder;
