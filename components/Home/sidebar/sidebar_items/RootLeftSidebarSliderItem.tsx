import { css, StyleSheet } from "aphrodite";
import { ReactElement, ReactNode, SyntheticEvent } from "react";
import colors from "~/config/themes/colors";

export type Props = {
  icon: ReactNode;
  isActive?: boolean;
  isMinimized?: boolean;
  label: string;
  onClick: (event: SyntheticEvent) => void;
};

export default function RootLeftSidebarSliderItem({
  icon,
  isActive = false,
  label,
  onClick,
}: Props): ReactElement {
  return (
    <div
      className={css(
        styles.rootLeftSidebarSliderItem,
        isActive && styles.rootLeftSidebarSliderItemActive
      )}
      onClick={onClick}
      role="button"
    >
      <div className={css(styles.iconWrap, isActive && styles.iconWrapActive)}>
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
  rootLeftSidebarSliderItem: {
    alignItems: "center",
    backbround: colors.GREY_ICY_BLUE_HUE,
    borderRadius: 4,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    height: 48,
    justifyContent: "flex-start",
    marginBottom: 16,
    minHeight: 48,
    overflow: "hidden",
    width: "100%",
    ":hover": {
      background: colors.LIGHTER_GREY(1),
    },
  },
  rootLeftSidebarSliderItemActive: {
    background: colors.BLUE_ACTIVE_BACKGROUND,
    ":hover": {
      background: colors.LIGHTER_GREY(1),
    },
  },
  iconWrap: {
    alignItems: "center",
    boxSizing: "border-box",
    color: colors.GREY(1),
    display: "flex",
    fontSize: "1.2em",
    textAlign: "center",
    height: 16,
    marginRight: 16,
    maxHeight: 16,
    maxWidth: 16,
    width: 16,
    userSelect: "none",
  },
  iconWrapActive: { color: colors.NEW_BLUE(1) },
  labelWrap: {
    alignItems: "center",
    color: colors.BLACK(1),
    display: "flex",
    fontSize: 18,
    fontWeight: 500,
    userSelect: "none",
  },
  labelWrapActive: {
    color: colors.NEW_BLUE(1),
  },
});
