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

export const ITEM_FADE_DURATION = 0.7;

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
    setTimeout((): void => setDidMount(true), 1000);
  }, []);
  /* avoids landing animation */
  const itemFadeDuration = didMount ? ITEM_FADE_DURATION : 0;

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
      <AnimatePresence initial={false} key={label}>
        {isMinimized ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={css(
              styles.iconWrapMin,
              isActive && styles.iconWrapActive
            )}
            initial={{ opacity: 0 }}
            key={`${label}-min`}
            transition={{ duration: itemFadeDuration }}
          >
            {icon}
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            className={css(styles.iconWrap, isActive && styles.iconWrapActive)}
            initial={{ opacity: 0 }}
            key={`${label}-max`}
            transition={{ duration: itemFadeDuration }}
          >
            {icon}
          </motion.div>
        )}
        {!isMinimized && (
          <motion.div
            animate={{ opacity: 1 }}
            className={css(
              styles.labelWrap,
              isActive && styles.labelWrapActive
            )}
            initial={{ opacity: 0 }}
            key={`${label}-max-label`}
            transition={{ duration: itemFadeDuration }}
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
    fontSize: 16,
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
    fontSize: "1em",
    height: 16,
    marginRight: 8,
    maxHeight: 16,
    maxWidth: 16,
    textAlign: "center",
    width: 16,
  },
  iconWrapMin: {
    alignItems: "center",
    boxSizing: "border-box",
    color: colors.GREY(1),
    display: "flex",
    fontSize: "1.2em",
    height: 16,
    marginRight: 8,
    maxHeight: 16,
    maxWidth: 16,
    textAlign: "center",
    width: 16,
  },
  iconWrapActive: { color: colors.NEW_BLUE(1) },
  labelWrap: {
    color: colors.BLACK(1),
    fontSize: 18,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  labelWrapActive: {
    color: colors.NEW_BLUE(1),
  },
});
