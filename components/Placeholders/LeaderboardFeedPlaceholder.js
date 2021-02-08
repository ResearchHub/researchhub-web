import React from "react";
import { StyleSheet, css } from "aphrodite";

import { TextBlock, RoundShape } from "react-placeholder/lib/placeholders";

const LeaderboardFeedPlaceholder = ({ color, rows }) => {
  return new Array(rows).fill(0).map((_, i) => {
    return (
      <div
        className={
          css(styles.placeholderContainer, i === 0 && styles.first) +
          " show-loading-animation"
        }
      >
        <RoundShape className={css(styles.round)} color={color} />
        <TextBlock
          className={css(styles.textRow)}
          rows={1}
          color={color}
          style={{ width: "100%" }}
        />
      </div>
    );
  });

  return Placeholders;
};

const styles = StyleSheet.create({
  first: {
    marginTop: 35,
  },
  placeholderContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },

  textRow: {
    marginLeft: 15,
  },
  round: {
    height: 40,
    width: 40,
    minWidth: 40,
    // margin: "10px 15px 0 0",
  },
});

export default LeaderboardFeedPlaceholder;
