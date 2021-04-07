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
    borderRadius: "4px",
    boxShadow: "rgb(0 0 0 / 10%) 2px 8px 8px",
    boxSizing: "border-box",
    display: "flex",
    fontWeight: 500,
    letterSpacing: 1.2,
    maxHeight: 40,
    overflow: "hidden",
    padding: "4px",
    maxWidth: "100%",
  },
  headerHighlightedText: {
    backgroundColor: "rgb(204 243 221)",
    borderRadius: "4px",
    boxSizing: "border-box",
    color: colors.BLACK(0.6),
    fontSize: 14,
    height: 24,
    maxWidth: 920,
    overflow: "hidden",
    padding: "4px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
  },
});
