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
      <RectShape style={{ width: "100%", height: 254 }} color={color} />
    </div>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    border: "1px solid rgb(237, 237, 237)",
    background: "#fff",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    boxSizing: "border-box",
  },
  textRow: {
    marginTop: 5,
  },
  space: {},
  label: {},
});

export default PreviewPlaceholder;
