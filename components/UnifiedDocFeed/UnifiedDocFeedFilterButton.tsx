import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import colors from "../../config/themes/colors";

type Props = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

export default function UnifiedDocFeedFilterButton({
  isActive,
  label,
  onClick,
}: Props): ReactElement<"div"> {
  return (
    <div
      className={css(
        styles.unifiedDocFeedFilterButton,
        isActive && styles.isButtonActive
      )}
      onClick={onClick}
      role="button"
    >
      <div>{label}</div>
    </div>
  );
}

const styles = StyleSheet.create({
  unifiedDocFeedFilterButton: {
    alignItems: "center",
    boxSizing: "border-box",
    color: "##241F3A",
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    height: 44,
    justifyContent: "flex-start",
    padding: "4px 0",
    marginRight: 24,
    width: 80,
  },
  isButtonActive: {
    borderBottom: `2px solid ${colors.BLUE(1)}`,
    color: colors.BLUE(1),
  },
});
