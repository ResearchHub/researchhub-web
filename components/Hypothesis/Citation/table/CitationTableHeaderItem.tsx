import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import colors from "~/config/themes/colors";

type Props = {
  center?: boolean;
  label: string;
  maxWidth?: string;
  width: string;
};

export default function CitationTableHeaderItem({
  center,
  label,
  maxWidth,
  width,
}: Props): ReactElement<"div"> {
  return (
    <div
      className={css(styles.headerItem, center ? styles.center : null)}
      style={{
        maxWidth: maxWidth ?? width,
        width,
      }}
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
    textTransform: "uppercase",
    wordWrap: "break-word",
  },
  center: {
    justifyContent: "center",
  },
});
