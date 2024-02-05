import { css, StyleSheet } from "aphrodite";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { faFire } from "@fortawesome/pro-solid-svg-icons";
import {
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type Props = {
  href: string;
  icon: ReactNode;
  isActive?: boolean;
  isMinimized: boolean;
  label: ReactNode;
  showNewFeatureIndicator?: boolean;
  onClick: (event: SyntheticEvent) => void;
  subItems?: ReactElement[];
  target?: undefined | "__blank";
};

export const ITEM_FADE_DURATION = 0.3;

export default function RootLeftSidebarItem({
  href,
  icon,
  isActive = false,
  isMinimized,
  label,
  showNewFeatureIndicator = false,
  onClick,
  subItems,
  target,
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

  return (
    <Link
      href={href}
      className={css(
        styles.rootLeftSidebarItem,
        isMinimizedLocal && isMinimized && styles.rootLeftSidebarItemMin,
        isActive && styles.rootLeftSidebarItemActive
      )}
      onClick={onClick}
      target={target}
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
            animate={"full"}
            className={css(
              styles.labelWrap,
              isActive && styles.labelWrapActive
            )}
            exit={"minimized"}
            initial={false}
            transition={{ duration: itemFadeDuration }}
            variants={{
              minimized: {
                display: "none",
                opacity: 0,
                width: 0,
              },
              full: {
                display: "visible",
                opacity: 1,
              },
            }}
          >
            {label}
          </motion.div>
        )}
        {!isMinimized && showNewFeatureIndicator && (
          <span className={css(styles.new)}>
            <span className={css(styles.fireIcon)}>
              {<FontAwesomeIcon icon={faFire}></FontAwesomeIcon>}
            </span>
            <span className={css(styles.newText)}>New</span>
          </span>
        )}
      </AnimatePresence>
    </Link>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebarItem: {
    alignItems: "center",
    backbround: colors.GREY_ICY_BLUE_HUE,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    height: 46,
    minHeight: 46,
    justifyContent: "flex-start",
    padding: "0 30px",
    width: "100%",
    overflow: "hidden",
    textDecoration: "none",
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
    fontSize: 18,
    textAlign: "center",
    marginRight: 16,
    userSelect: "none",
    width: 18,
    height: 18,
  },
  iconWrapActive: { color: colors.NEW_BLUE(1) },
  iconWrapMin: { marginRight: 0 },
  labelWrap: {
    alignItems: "center",
    color: colors.BLACK(1),
    display: "flex",
    fontSize: 16,
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
