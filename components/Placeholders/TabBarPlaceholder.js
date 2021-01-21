import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import { TextRow, RectShape } from "react-placeholder/lib/placeholders";

const TabBarPlaceholder = ({ color }) => (
  <div className={css(styles.placeholderContainer) + " show-loading-animation"}>
    <TextRow className={css(styles.textRow)} color={color} />
    <RectShape className={css(styles.count)} rows={1} color={color} />
    <TextRow className={css(styles.textRow)} color={color} />
    <RectShape className={css(styles.count)} rows={1} color={color} />
    <TextRow className={css(styles.textRow)} color={color} />
    <RectShape className={css(styles.count)} rows={1} color={color} />
    <TextRow className={css(styles.textRow)} color={color} />
    <RectShape className={css(styles.count)} rows={1} color={color} />
    <TextRow className={css(styles.textRow)} color={color} />
    <RectShape
      className={css(styles.count, styles.last)}
      rows={1}
      color={color}
    />
  </div>
);

const styles = StyleSheet.create({
  placeholderContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    height: 54,
    boxSizing: "border-box",
  },
  textRow: {
    width: "15%",
    height: 25,
    marginBottom: 16,
  },
  last: {
    marginRight: 0,
  },
  count: {
    height: 25,
    width: 40,
    marginLeft: 5,
    marginRight: 20,
    marginBottom: 5,
  },
});

export default TabBarPlaceholder;
