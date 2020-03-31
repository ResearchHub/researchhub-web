import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import {
  TextBlock,
  MediaBlock,
  TextRow,
  RectShape,
  RoundShape,
} from "react-placeholder/lib/placeholders";

const PaperPagePlaceholder = ({ color }) => (
  <div className={css(styles.placeholderContainer) + " show-loading-animation"}>
    <div className={css(styles.spaceBetween)}>
      <TextBlock
        className={css(styles.textRow)}
        rows={1}
        color={color}
        style={{ width: "30%" }}
      />
      <div className={css(styles.row)}>
        <RoundShape
          className={css(styles.actions)}
          color={color}
          style={{ width: 30, height: 30 }}
        />
        <RoundShape
          className={css(styles.actions)}
          color={color}
          style={{ width: 30, height: 30, margin: "0px 10px" }}
        />
        <RoundShape
          className={css(styles.actions)}
          color={color}
          style={{ width: 30, height: 30 }}
        />
      </div>
    </div>
    <div className={css(styles.marginBottom)}>
      <TextBlock
        className={css(styles.textRow)}
        rows={1}
        color={color}
        style={{ width: "80%" }}
      />
      <TextBlock
        className={css(styles.textRow)}
        rows={1}
        color={color}
        style={{ width: "80%" }}
      />
      <TextBlock
        className={css(styles.textRow)}
        rows={1}
        color={color}
        style={{ width: "80%" }}
      />
    </div>
    <div className={css(styles.marginBottom)}>
      <TextBlock
        className={css(styles.textRow)}
        rows={1}
        color={color}
        style={{ width: "20%" }}
      />
    </div>
    <TextBlock
      className={css(styles.textRow)}
      rows={1}
      color={color}
      style={{ width: "20%" }}
    />
  </div>
);

const styles = StyleSheet.create({
  placeholderContainer: {
    width: "100%",
    height: "100%",
  },
  textRow: {},
  row: {
    display: "flex",
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  marginBottom: {
    marginBottom: 16,
  },
  space: {},
  label: {},
});

export default PaperPagePlaceholder;
