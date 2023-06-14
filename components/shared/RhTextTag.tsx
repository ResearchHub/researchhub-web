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
}: Props): ReactElement {
  return (
    <div id="RhTextTag-Wrap" style={{ position: "relative" }}>
      <div
        id="RhTextTag-Wrap"
        style={{
          alignItems: "center",
          background: backgroundColor ?? "black",
          borderRadius: "8px",
          color: textColor ?? "#fff",
          display: "flex",
          fontSize: fontSize ?? "inherit",
          height: height ?? width,
          justifyContent: "center",
          position: "absolute",
          textAlign: "center",
          right: 0,
          top: 0,
          width,
          ...(tagPosition ?? {}),
        }}
      >
        {tagLabel}
      </div>
      {children}
    </div>
  );
}
