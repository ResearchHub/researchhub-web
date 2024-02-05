import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import { faFire } from "@fortawesome/pro-solid-svg-icons";
import { ReactElement, ReactNode, SyntheticEvent } from "react";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type Props = {
  icon: ReactNode;
  isActive?: boolean;
  isMinimized?: boolean;
  label: string;
  showNewFeatureIndicator?: boolean;
  href: string;
  onClick: (event: SyntheticEvent) => void;
};

export const ITEM_FADE_DURATION = 0.3;

export default function RootLeftSidebarSliderItem({
  icon,
  isActive = false,
  label,
  showNewFeatureIndicator = false,
  href,
  onClick,
}: Props): ReactElement {
  return (
    <Link
      href={href}
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
      {showNewFeatureIndicator && (
        <span className={css(styles.new)}>
          <span className={css(styles.fireIcon)}>
            {<FontAwesomeIcon icon={faFire}></FontAwesomeIcon>}
          </span>
          <span className={css(styles.newText)}>New</span>
        </span>
      )}
    </Link>
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
    minHeight: 48,
    overflow: "hidden",
    width: "100%",
    textDecoration: "none",
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

  // new feature indicator
  new: {
    display: "flex",
    alignItems: "center",
    background: colors.NEW_BLUE(0.1),
    borderRadius: "5px",
    padding: "4px 6px",
    marginLeft: "auto",
  },
  newText: {
    fontWeight: 500,
    fontSize: 14,
    color: colors.NEW_BLUE(0.9),
  },
  fireIcon: {
    fontSize: 14,
    marginRight: 5,
    color: colors.NEW_BLUE(0.9),
  },
});
