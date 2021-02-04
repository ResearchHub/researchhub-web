import React from "react";
import { StyleSheet, css } from "aphrodite";

import { TextBlock, RoundShape } from "react-placeholder/lib/placeholders";

const LeaderboardPlaceholder = ({ color, rows = 1 }) => {
  return new Array(rows).fill(0).map((el, i) => {
    return (
      <div
        className={css(styles.placeholderContainer) + " show-loading-animation"}
      >
        <div className={css(styles.row)}>
          <RoundShape className={css(styles.round)} color={color} />
          <TextBlock
            className={css(styles.textRow)}
            rows={1}
            color={color}
            style={{ width: "50%" }}
          />
          <TextBlock
            className={css(styles.textRow)}
            rows={1}
            color={color}
            style={{ width: "20%" }}
          />
        </div>
      </div>
    );
  });
};

const styles = StyleSheet.create({
  placeholderContainer: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 20px",
    borderLeft: "3px solid #FFF",
  },
  round: {
    height: 38,
    minHeight: 38,
    maxHeight: 38,
    width: 38,
    minWidth: 38,
    maxWidth: 38,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textRow: {},
  rep: {},
});

export default LeaderboardPlaceholder;
