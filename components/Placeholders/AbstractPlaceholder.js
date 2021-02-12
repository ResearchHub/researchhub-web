import React from "react";
import { StyleSheet, css } from "aphrodite";

import { TextBlock, TextRow } from "react-placeholder/lib/placeholders";

const AbstractPlaceholder = ({ color }) => (
  <div className={"show-loading-animation"}>
    <TextBlock
      className={css(styles.textRow)}
      rows={5}
      color={color}
      style={{ width: "100%" }}
    />
    <TextRow
      className={css(styles.textRow)}
      color={color}
      style={{ width: "80%" }}
    />
  </div>
);

const styles = StyleSheet.create({
  placeholderContainer: {
    borderRadius: 3,
    border: "1px solid rgb(237, 237, 237)",
    padding: "23px 15px",
    paddingLeft: 80,
    background: "#fff",
  },
  textRow: {
    marginBottom: 16,
  },
  space: {},
  label: {},
});

export default AbstractPlaceholder;
