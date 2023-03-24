import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import colors from "../../config/themes/colors";

type Props = {
  count?: number;
  isActive: boolean;
  label: string;
  onClick: () => void;
};

export default function AuthorClaimDashboardNavbarButton({
  count = 0,
  label,
  isActive,
  onClick,
}: Props): ReactElement<"div"> {
  return (
    <div
      className={css(
        styles.authorClaimDashboardNavbarButton,
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
  authorClaimDashboardNavbarButton: {
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
  buttonCount: {
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 4,
    color: "#241F3A",
    display: "flex",
    height: 20,
    justifyContent: "center",
    marginLeft: 12,
    fontSize: 12,
    minWidth: 32,
  },
});
