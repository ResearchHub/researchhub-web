import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import { TextRow } from "react-placeholder/lib/placeholders";
import colors from "~/config/themes/colors";

export default function CitationTableRowItemPlaceholder(): ReactElement<"div"> {
  return (
    <div className={css(styles.tableRowItem) + " show-loading-animation"}>
      <TextRow
        color={colors.LIGHT_GREY_BORDER}
        style={{ width: "95%", height: 24, margin: "0 auto", borderRadius: 4 }}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  tableRowItem: {
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    width: "100%",
    height: 52,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
