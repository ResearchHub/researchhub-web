import { css, StyleSheet } from "aphrodite";
import { TextRow } from "react-placeholder/lib/placeholders";
import colors from "~/config/themes/colors";
import React, { ReactElement, ReactNode } from "react";

export default function CitationTableRowItemPlaceholder(): ReactElement<"div"> {
  return (
    <div className={css(styles.tableRowItem)}>
      <TextRow
        color={colors.LIGHT_GREY_BORDER}
        style={{ width: "100%", height: 24, margin: "16px 0", borderRadius: 4 }}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  tableRowItem: {
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
