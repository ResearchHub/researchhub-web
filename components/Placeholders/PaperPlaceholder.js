import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import {
  TextBlock,
  MediaBlock,
  TextRow,
  RectShape,
  RoundShape,
} from "react-placeholder/lib/placeholders";

const PaperPlaceholder = ({ color }) => (
  <div className={css(styles.placeholderContainer) + " show-loading-animation"}>
    <TextBlock
      className={css(styles.textRow)}
      rows={1}
      color={color}
      style={{ width: "75%" }}
    />
    <TextBlock
      className={css(styles.textRow)}
      rows={1}
      color={color}
      style={{ width: "25%" }}
    />
    <TextBlock
      className={css(styles.textRow)}
      rows={1}
      color={color}
      style={{ width: "40%" }}
    />
  </div>
);

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    border: "1px solid rgb(237, 237, 237)",
    padding: "27px 15px",
    paddingLeft: 80,
    background: "#fff",
    width: "100%",
  },
  textRow: {
    marginBottom: 16,
  },
  space: {},
  label: {},
});

export default PaperPlaceholder;
