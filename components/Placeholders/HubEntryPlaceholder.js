import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import { TextBlock } from "react-placeholder/lib/placeholders";

const HubEntryPlaceholder = ({ color, rows }) => {
  let blocks = new Array(rows).fill(0).map((el, i) => {
    return (
      <TextBlock
        key={`hubPlaceholder-${i}`}
        className={css(styles.textRow)}
        rows={1}
        color={color}
      />
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
  placeholderContainer: {
    paddingLeft: 5,
    width: "100%",
  },
  textRow: {
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
  },
  space: {},
  label: {},
});

export default HubEntryPlaceholder;
