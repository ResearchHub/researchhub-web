import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import colors from "~/config/themes/colors";

type Props = {
  center?: boolean;
  className?: Object;
  label: string;
  maxWidth?: string;
  width: string;
};

export default function CitationTableHeaderItem({
  center,
  className,
  label,
  maxWidth,
  width,
}: Props): ReactElement<"div"> {
  return (
    <div
      className={css(
        styles.headerItem,
        center ? styles.center : null,
        className
      )}
      style={{
        maxWidth: maxWidth ?? width,
        minWidth: width,
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
    // boxSizing: "border-box",
    color: colors.LIGHT_GREY_TEXT,
    display: "flex",
    fontSize: 12,
    fontWeight: 700,
    height: "100%",
    justifyContent: "flex-start",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    wordWrap: "break-word",
  },
  center: {
    justifyContent: "center",
  },
});
