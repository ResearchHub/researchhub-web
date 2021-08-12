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
    color: colors.TEXT_GREY(1),
    display: "flex",
    fontWeight: 500,
    height: "100%",
    justifyContent: "flex-start",
    padding: "0 8px",
  },
});
