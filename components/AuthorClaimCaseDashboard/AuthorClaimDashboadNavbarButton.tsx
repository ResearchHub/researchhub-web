import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import colors from "../../config/themes/colors";

type Props = {
  count?: number;
  isActive: boolean;
  label: string;
  onClick: () => void;
};

export default function AuthorClaimDashboadNavbarButton({
  count = 0,
  label,
  isActive,
  onClick,
}: Props): ReactElement<"div"> {
  return (
    <div
      className={css(
        styles.authorClaimDashboadNavbarButton,
        isActive && styles.isButtonActive
      )}
      onClick={onClick}
      role="button"
    >
      <div>{label}</div>
      <div className={css(styles.buttonCount)}>{count}</div>
    </div>
  );
}

const styles = StyleSheet.create({
  authorClaimDashboadNavbarButton: {
    alignItems: "center",
    color: "##241F3A",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    padding: 8,
    width: 136,
    fontSize: 18,
  },
  isButtonActive: {
    borderBottom: `2px solid ${colors.BLUE(1)}`,
    color: colors.BLUE(1),
  },
  buttonCount: {
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 4,
    color: "#241F3A",
    display: "flex",
    height: 40,
    justifyContent: "center",
    marginLeft: 16,
    width: 40,
  },
});
