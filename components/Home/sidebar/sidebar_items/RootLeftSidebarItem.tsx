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

export const ITEM_FADE_DURATION = 0.3; // in sec
export const BAR_ANIMATION_DURATION = 0.4;

export default function RootLeftSidebarItem({
  icon,
  isActive = false,
  isMinimized,
  label,
  onClick,
  subItems,
}: Props): ReactElement {
  const [didMount, setDidMount] = useState<boolean>(false);

  /* avoids landing animation */
  const trueItemFadeDuration = didMount ? ITEM_FADE_DURATION : 0;

  useEffect((): void => {
    setTimeout((): void => setDidMount(true), 2000);
  }, []);

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
      <AnimatePresence
        initial={false}
        key={`root-left-sidebar-item-animation-presence-${label}`}
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
          key={label}
          animate={isMinimized ? "minimized" : "full"}
          className={css(isActive && styles.labelWrapActive)}
          initial={false}
          transition={{ duration: trueItemFadeDuration }}
          variants={{
            minimized: {
              display: "none",
              opacity: 0,
              width: 0,
            },
            full: {
              alignItems: "center",
              color: colors.BLACK(1),
              display: "flex",
              fontSize: 18,
              fontWeight: 500,
              opacity: 1,
              userSelect: "none",
            },
          }}
        >
          {label}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebarItem: {
    alignItems: "center",
    backbround: colors.GREY_ICY_BLUE_HUE,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    height: 48,
    justifyContent: "flex-start",
    marginBottom: 16,
    padding: "0 26px",
    width: "100%",
    overflow: "hidden",
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
    textAlign: "center",
    height: 16,
    marginRight: 16,
    maxHeight: 16,
    maxWidth: 16,
    width: 16,
    userSelect: "none",
  },
  iconWrapActive: { color: colors.NEW_BLUE(1) },
  iconWrapMin: { marginRight: 6 },
  labelWrapActive: {
    color: colors.NEW_BLUE(1),
  },
});
