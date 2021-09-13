import { css, StyleSheet } from "aphrodite";
import { SyntheticEvent } from "react";
import colors from "~/config/themes/colors";

type Props = {
  icon?: string;
  label: string;
  onSelect: Function;
};

export default function SourceSearchInputItem({ onSelect, label }: Props) {
  return (
    <div
      className={css(itemStyle.sourceSearchInputItem)}
      onClickCapture={(event: SyntheticEvent): void => {
        event.stopPropagation(), event.preventDefault();
        onSelect(event);
      }}
      role="button"
    >
      <span className={css(itemStyle.textLabel)}>{label}</span>
    </div>
  );
}

export const itemStyle = StyleSheet.create({
  sourceSearchInputItem: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    boxSizing: "border-box",
    color: "black",
    cursor: "pointer",
    display: "flex",
    minHeight: 37,
    overflow: "hidden",
    padding: "0 12px",
    whiteSpace: "nowrap",
    width: "100%",
    ":hover": {
      backgroundColor: colors.LIGHT_BLUE(0.7),
    },
  },
  textLabel: {
    maxWidth: 580,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});
