import { css, StyleSheet } from "aphrodite";
import { ReactElement, ReactNode, SyntheticEvent } from "react";
import colors from "~/config/themes/colors";

export type Props = {
  icon: ReactNode;
  isActive?: boolean;
  label: string;
  onClick: (event: SyntheticEvent) => void;
  subItems?: ReactElement[];
};

export default function RootLeftSidebarItem({
  icon,
  isActive = false,
  label,
  onClick,
  subItems,
}: Props): ReactElement {
  return (
    <div
      className={css(
        styles.rootLeftSidebarItem,
        isActive && styles.rootLeftSidebarItemActive
      )}
      onClick={onClick}
      role="button"
    >
      <div className={css(styles.iconWrap, isActive && styles.icontWrapActive)}>
        {icon}
      </div>
      <div
        className={css(styles.labelWrap, isActive && styles.labelWrapActive)}
      >
        {label}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebarItem: {
    alignItems: "center",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    height: 48,
    justifyContent: "flex-start",
    marginBottom: 16,
    padding: "0 16px",
    width: "100%",
    ":hover": {
      background: colors.LIGHTER_GREY(1),
    },
  },
  rootLeftSidebarItemActive: {
    background: colors.BLUE_ACTIVE_BACKGROUND,
    ":hover": { background: colors.BLUE_ACTIVE_BACKGROUND },
  },
  iconWrap: {
    color: colors.GREY(1),
    fontSize: 18,
    width: 18,
    marginRight: 8,
    display: "flex",
    alignItems: "center",
  },
  icontWrapActive: { color: colors.NEW_BLUE(1) },
  labelWrap: {
    color: colors.BLACK(1),
    fontSize: 18,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  labelWrapActive: { color: colors.NEW_BLUE(1) },
});
