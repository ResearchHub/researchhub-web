import { css, StyleSheet } from "aphrodite";
import { TextRow } from "react-placeholder/lib/placeholders";
import colors from "~/config/themes/colors";
import { ReactElement, ReactNode } from "react";

export default function CitationTableRowItemPlaceholder(): ReactElement<"div"> {
  return (
    <div className={css(styles.tableRowItem)}>
      <TextRow
        color={colors.LIGHT_GREY_BORDER}
        style={{ width: "90%", height: 24, margin: "16px 0", borderRadius: 4 }}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  tableRowItem: {
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    width: "100%",
    margin: '0 auto',
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
