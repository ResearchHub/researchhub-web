import React from "react";
import { StyleSheet, css } from "aphrodite";

import {
  TextBlock,
  TextRow,
  RectShape,
  RoundShape,
} from "react-placeholder/lib/placeholders";

const PaperPlaceholder = ({ color, rows }) => {
  const placeholder = (
    <div className={css(styles.root) + " show-loading-animation"}>
      <RoundShape className={css(styles.round)} color={color} />
      <div className={css(styles.placeholderContainer)}>
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
          style={{ width: "50%" }}
        />
        <RoundShape className={css(styles.authorAvatar)} color={color} />
      </div>
      <div className={css(styles.column)}>
        <RectShape className={css(styles.preview)} color={color} />
        <div className={css(styles.row)}>
          <RectShape className={css(styles.tagImage)} color={color} />
          <TextRow className={css(styles.tag)} color={color} />
        </div>
      </div>
    </div>
  );

  const Placeholders = new Array(rows).fill(placeholder);

  return Placeholders;
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  placeholderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    width: "100%",
  },
  textRow: {
    marginBottom: 15,
  },
  round: {
    height: 30,
    width: 45,
    minWidth: 45,
    margin: "10px 15px 0 0",
  },
  preview: {
    height: 90,
    maxHeight: 90,
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    boxSizing: "border-box",
    margin: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  authorAvatar: {
    height: 30,
    width: 30,
    borderRadius: "50%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  row: {
    display: "flex",
    alignItems: "center",
    marginTop: "0.7em",
  },
  tagImage: {
    height: 20,
    width: 20,
    minWidth: 20,
    minHeight: 20,
    marginRight: 6,
    borderRadius: 3,
  },
  tag: {
    width: 100,
    margin: 0,
  },
  space: {},
  label: {},
});

export default PaperPlaceholder;
