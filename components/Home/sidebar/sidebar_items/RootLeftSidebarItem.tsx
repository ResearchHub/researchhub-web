import { css, StyleSheet } from "aphrodite";
import { AnimatePresence, motion } from "framer-motion";
import {
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import colors from "~/config/themes/colors";

export type Props = {
  icon: ReactNode;
  isActive?: boolean;
  isMinimized: boolean;
  label: string;
  onClick: (event: SyntheticEvent) => void;
  subItems?: ReactElement[];
};

export const ITEM_FADE_DURATION = 0.3;

export default function RootLeftSidebarItem({
  icon,
  isActive = false,
  isMinimized,
  label,
  onClick,
  subItems,
}: Props): ReactElement {
  const [didMount, setDidMount] = useState<boolean>(false);
  useEffect((): void => {
    setTimeout((): void => setDidMount(true), 2000);
  }, []);
  /* avoids landing animation */
  const itemFadeDuration = didMount ? ITEM_FADE_DURATION : 0;

  const variants = {
    minimized: {
      opacity: 0,
      width: 0,
      transform: "scaleX(0)",
    },
    full: {
      opacity: 1,
      width: "100%",
      transform: "scaleX(1)",
    },
  };

  return (
    <div
      className={css(
        styles.rootLeftSidebarItem,
        isMinimized && styles.rootLeftSidebarItemMin,
        isActive && styles.rootLeftSidebarItemActive
      )}
      onClick={onClick}
      role="button"
    >
      <div
        className={css(
          styles.iconWrap,
          isMinimized && styles.iconWrapMin,
          isActive && styles.iconWrapActive
        )}
      >
        {icon}
      </div>
      <motion.div
        initial={false}
        className={css(styles.labelWrap, isActive && styles.labelWrapActive)}
        transition={{ duration: itemFadeDuration }}
        animate={isMinimized ? "minimized" : "full"}
        variants={variants}
      >
        {label}
      </motion.div>
    </div>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebarItem: {
    alignItems: "center",
    backbround: colors.GREY_ICY_BLUE_HUE,
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
  },
  rootLeftSidebarItemMin: {
    justifyContent: "center",
    padding: 0,
  },
  rootLeftSidebarItemActive: {
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
    height: 16,
    marginRight: 16,
    maxHeight: 16,
    maxWidth: 16,
    textAlign: "center",
    width: 16,
    userSelect: "none",
  },
  iconWrapActive: { color: colors.NEW_BLUE(1) },
  iconWrapMin: { marginRight: 6 },
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
