import { ReactElement, ReactNode } from "react";
import colors from "~/config/themes/colors";

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
        style={{
          alignItems: "center",
          background: backgroundColor ?? colors.PURE_BLACK(),
          borderRadius: "8px",
          color: textColor ?? colors.WHITE(),
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
