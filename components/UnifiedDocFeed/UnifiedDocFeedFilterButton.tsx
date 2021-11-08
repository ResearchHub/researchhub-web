import { css, StyleSheet } from "aphrodite";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import colors from "../../config/themes/colors";

type Props = {
  isActive: boolean;
  label: string;
  onClick?: (event: SyntheticEvent) => void;
};

function UnifiedDocFeedFilterButton({
  isActive,
  label,
  onClick,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.container)} onClick={onClick}>
      <div
        className={css(
          styles.unifiedDocFeedFilterButton,
          isActive && styles.isButtonActive
        )}
        role="button"
      >
        {label}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  unifiedDocFeedFilterButton: {
    alignItems: "center",
    boxSizing: "border-box",
    color: "#241F3A",
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    height: 44,
    justifyContent: "center",
    padding: "4px 0",
    // marginRight: 24,
    borderBottom: "2px solid transparent",
  },
  isButtonActive: {
    borderBottom: `2px solid ${colors.BLUE(1)}`,
    color: colors.BLUE(1),
  },
});

export default UnifiedDocFeedFilterButton;
