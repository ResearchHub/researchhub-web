import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import colors from "../../../../config/themes/colors";

type Props = {
  label: string;
  width: string;
};

export default function CitationTableHeaderItem({
  label,
  width,
}: Props): ReactElement<"div"> {
  return (
    <div
      className={css(styles.headerItem)}
      style={{ maxWidth: width, minWidth: width, width }}
    >
      {label}
    </div>
  );
}

const styles = StyleSheet.create({
  headerItem: {
    alignItems: "center",
    color: colors.LIGHT_GREY_TEXT,
    display: "flex",
    fontWeight: 700,
    height: "100%",
    fontSize: 12,
    letterSpacing: "1.2px",
    justifyContent: "flex-start",
    // padding: "0 8px",
    textTransform: "uppercase",
    wordWrap: "break-word",
  },
});
