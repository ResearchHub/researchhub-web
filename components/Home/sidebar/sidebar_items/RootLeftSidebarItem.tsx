import { css, StyleSheet } from "aphrodite";
import { ReactElement, ReactNode, SyntheticEvent } from "react";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

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
    boxSizing: "border-box",
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
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      justifyContent: "center",
    },
  },
  rootLeftSidebarItemActive: {
    background: colors.BLUE_ACTIVE_BACKGROUND,
    ":hover": { background: colors.BLUE_ACTIVE_BACKGROUND },
  },
  iconWrap: {
    alignItems: "center",
    boxSizing: "border-box",
    color: colors.GREY(1),
    display: "flex",
    fontSize: "1em",
    height: 16,
    marginRight: 8,
    maxHeight: 16,
    maxWidth: 16,
    textAlign: "center",
    width: 16,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      fontSize: "1.2em",
    },
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
