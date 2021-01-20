import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import { RectShape } from "react-placeholder/lib/placeholders";

const TabBarPlaceholder = ({ color }) => (
  <div className={css(styles.placeholderContainer) + " show-loading-animation"}>
    <RectShape className={css(styles.textRow)} rows={1} color={color} />
    <RectShape className={css(styles.textRow)} rows={1} color={color} />
    <RectShape className={css(styles.textRow)} rows={1} color={color} />
    <RectShape className={css(styles.textRow)} rows={1} color={color} />
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
    width: "25%",
    height: 25,
    marginRight: 15,
    marginBottom: 5,
  },
  space: {},
  label: {},
});

export default TabBarPlaceholder;
