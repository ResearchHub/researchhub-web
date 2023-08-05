import { css, StyleSheet } from "aphrodite";
import { ReactElement, ReactNode } from "react";

type Props = {
  backgroundColor?: string;
  children: ReactNode;
  fontSize?: string;
  height?: string;
  tagLabel: ReactNode;
  tagPosition?: {
    bottom?: string;
    left?: string;
    right?: string;
    top?: string;
    zIndex?: number;
  };
  textColor?: string;
  width: string;
  textTransform?: string;
  style?: unknown;
};

export default function RhTextTag({
  backgroundColor,
  children,
  fontSize,
  height,
  tagLabel,
  tagPosition,
  textColor,
  width,
  textTransform,
  style,
}: Props): ReactElement {
  return (
    <div id="RhTextTag-Wrap" style={{ position: "relative" }}>
      <div
        className={css(styles.label)}
        style={{
          alignItems: "center",
          background: backgroundColor ?? "black",
          borderRadius: "8px",
          color: textColor ?? "#fff",
          display: "flex",
          fontSize: fontSize ?? "inherit",
          textTransform: textTransform,
          height: height ?? width,
          justifyContent: "center",
          position: "absolute",
          textAlign: "center",
          right: 0,
          top: 0,
          width,
          ...(tagPosition ?? {}),
          ...(style ?? {}),
        }}
      >
        {tagLabel}
      </div>
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  label: {
    "@media only screen and (max-width: 767px)": {
      right: -8,
      bottom: -16,
    },
  },
});
