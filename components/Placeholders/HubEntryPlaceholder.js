import React from "react";
import { StyleSheet, css } from "aphrodite";

import { TextBlock, RectShape } from "react-placeholder/lib/placeholders";

// Config
import colors from "~/config/themes/colors";

const HubEntryPlaceholder = ({ color, rows }) => {
  const blocks = new Array(rows).fill(0).map((el, i) => {
    return (
      <div
        className={
          css(styles.root, i === 0 && styles.first) + " show-loading-animation"
        }
      >
        <div className={css(styles.container)}>
          <RectShape className={css(styles.imagePlaceholder)} />
          <TextBlock
            key={`hubPlaceholder-${i}`}
            className={css(styles.textRow)}
            rows={1}
            color={color}
          />
        </div>
      </div>
    );
  });

  return (
    <div
      className={css(styles.placeholderContainer) + " show-loading-animation"}
    >
      {blocks}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    transition: "all ease-out 0.1s",
    borderRadius: 3,
    borderBottom: "1px solid #F0F0F0",
    borderLeft: "3px solid #FFF",
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
    },
  },
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
  },
  first: {
    paddingTop: 0,
  },
  placeholderContainer: {
    width: "100%",
    boxSizing: "border-box",
  },
  textRow: {
    width: "100%",
  },
  imagePlaceholder: {
    height: 35,
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    borderRadius: 4,
    objectFit: "cover",
    marginRight: 10,
    background: "#EAEAEA",
    border: "1px solid #ededed",
  },
  space: {},
  label: {},
});

export default HubEntryPlaceholder;
