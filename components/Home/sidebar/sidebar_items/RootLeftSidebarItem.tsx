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
  const [isMinimizedLocal, setIsMinimizedLocal] = useState<boolean>(false);

  /* avoids landing animation */
  const itemFadeDuration = didMount ? ITEM_FADE_DURATION : 0;

  useEffect((): void => {
    setTimeout((): void => setDidMount(true), 2000);
  }, []);

  useEffect((): void => {
    if (isMinimized) {
      setTimeout(() => {
        setIsMinimizedLocal(isMinimized);
      }, ITEM_FADE_DURATION * 1000 + 10);
    } else {
      setIsMinimizedLocal(isMinimized);
    }
  }, [isMinimized]);

  const variants = {
    minimized: {
      opacity: 0,
      display: "none",
      // width: 0,
      // transform: "scaleX(0)",
    },
    full: {
      opacity: 1,
      display: "visible",
      // width: "100%",
      // transform: "scaleX(1)",
    },
  };

  return (
    <div
      className={css(
        styles.rootLeftSidebarItem,
        isMinimizedLocal && isMinimized && styles.rootLeftSidebarItemMin,
        isActive && styles.rootLeftSidebarItemActive
      )}
      onClick={onClick}
      role="button"
    >
      <div
        className={css(
          styles.iconWrap,
          isMinimizedLocal && isMinimized && styles.iconWrapMin,
          isActive && styles.iconWrapActive
        )}
      >
        {icon}
      </div>
      <AnimatePresence initial={false}>
        {!isMinimized && (
          <motion.div
            initial={false}
            className={css(
              styles.labelWrap,
              isActive && styles.labelWrapActive
            )}
            transition={{ duration: itemFadeDuration }}
            // initial={"minimized"}
            animate={"full"}
            exit={"minimized"}
            variants={variants}
          >
            {label}
          </motion.div>
        )}
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
