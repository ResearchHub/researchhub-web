import { css, StyleSheet } from "aphrodite";
import colors from "../../config/themes/colors";
import React, { ReactElement } from "react";

type Props = { title: string };

export default function InlineCommentContextTitle({
  title,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.headerHighlightedTextContainer)}>
      <span className={css(styles.headerHighlightedText)}>{title}</span>
    </div>
  );
}

const styles = StyleSheet.create({
  headerHighlightedTextContainer: {
    alignItems: "center",
    background: "#fff",
    boxShadow: "rgb(0 0 0 / 10%) 2px 8px 8px",
    boxSizing: "border-box",
    display: "flex",
    fontSize: 12,
    fontWeight: 500,
    height: 40,
    letterSpacing: 1.2,
    marginBottom: 12,
    padding: "4px",
    width: "100%",
  },
  headerHighlightedText: {
    backgroundColor: "rgb(204 243 221)",
    color: colors.BLACK(0.6),
    textDecoration: "italic",
    padding: "8px 4px",
  },
});
