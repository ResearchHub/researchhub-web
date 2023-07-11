import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { createPortal } from "react-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { CommentTreeContext } from "./lib/contexts";
import config, { contextConfig } from "./lib/config";
import { breakpoints } from "~/config/themes/screen";
import { COMMENT_CONTEXTS } from "./lib/types";

type Args = {
  setIsOpen: Function;
  isOpen: boolean;
  bountyAmount: number;
  commentCount: number;
};

const CommentToggle = ({
  isOpen,
  setIsOpen,
  bountyAmount = 0,
  commentCount = 0,
}: Args) => {
  const hasActiveBounties = bountyAmount > 0;
  const bountyDisplayVal =
    bountyAmount > 1000
      ? (bountyAmount / 1000).toFixed(0) + "k"
      : bountyAmount.toFixed(0);
  const commentTreeState = useContext(CommentTreeContext);
  const [mountEl, setMountEl] = useState<Element | null>(null);
  const prevScrollYPos = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (!mountEl) {
      const _mountEl =
        document.body.querySelector("#mainContent") || document.body;
      setMountEl(_mountEl);
    }
  }, []);

  if (commentTreeState.context === COMMENT_CONTEXTS.SIDEBAR) {
    useEffect(() => {
      const _handleScroll = () => {
        if (window.scrollY > prevScrollYPos.current && isVisibleRef.current) {
          setIsVisible(false);
          isVisibleRef.current = false;
        } else if (
          window.scrollY < prevScrollYPos.current &&
          !isVisibleRef.current
        ) {
          setIsVisible(true);
          isVisibleRef.current = true;
        }

        prevScrollYPos.current = window.scrollY;
      };

      document.addEventListener("scroll", _handleScroll);

      return () => {
        document.removeEventListener("scroll", _handleScroll);
      };
    }, []);
  }

  return (
    <>
      {mountEl &&
        createPortal(
          <div
            className={css(
              styles.toggle,
              isVisible ? styles.visibleToggle : styles.hiddenToggle,
              commentTreeState.context === COMMENT_CONTEXTS.SIDEBAR &&
                isOpen &&
                styles.sidebarOpen
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={css(
                styles.item,
                hasActiveBounties && styles.withBounty
              )}
            >
              <div>
                <FontAwesomeIcon
                  // @ts-ignore
                  icon={faComments}
                  style={{ color: colors.toggle.commentIcon }}
                />
              </div>
              <div>{commentCount}</div>
            </div>
            {hasActiveBounties && (
              <>
                <div
                  style={{ border: `1px solid ${colors.border}`, height: 20 }}
                ></div>
                <div className={css(styles.item, styles.bountyItem)}>
                  <div>
                    <ResearchCoinIcon version={2} height={25} width={25} />
                  </div>
                  <div>{bountyDisplayVal}</div>
                </div>
              </>
            )}
          </div>,
          mountEl
        )}
    </>
  );
};

const slideDownFrames = {
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
};

const slideUpFrames = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
};

const styles = StyleSheet.create({
  hiddenToggle: {
    animationName: [slideDownFrames],
    animationDuration: "0.25s",
    animationDirection: "normal",
    animationFillMode: "forwards",
    animationTiming: "ease-in",
  },
  visibleToggle: {
    animationName: [slideUpFrames],
    animationDuration: "0.25s",
    animationDirection: "normal",
    animationFillMode: "forwards",
    animationTiming: "ease-in",
  },
  toggle: {
    position: "fixed",
    left: `calc(50% + ${config.toggle.width / 2}px)`,
    bottom: 15,
    alignItems: "center",
    display: "flex",
    // transform: "translate(-50%, -50%)",
    transform: "translateX(50%)",
    zIndex: 1000000,
    borderRadius: 100,
    minWidth: config.toggle.width,
    background: "white",
    cursor: "pointer",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
    userSelect: "none",
    border: `1px solid ${colors.border}`,
    ":hover": {
      background: colors.hover.background,
    },

    [`@media only screen and (max-width: ${contextConfig.sidebar.fixedPosMaxWidth}px)`]:
      {
        left: `calc(50% + ${config.toggle.width / 2}px)`,
      },
    [`@media only screen and (max-width: ${breakpoints.large.int}px)`]: {
      left: `calc(50% - ${config.toggle.width}px)`,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.int}px)`]: {
      left: `calc(50% - ${config.toggle.width}px)`,
    },
  },
  sidebarOpen: {
    [`@media only screen and (min-width: ${contextConfig.sidebar.fixedPosMaxWidth}px)`]:
      {
        left: `calc(50% - ${contextConfig.sidebar.width / 2 - 75 / 2}px)`,
      },
  },
  item: {
    padding: "12px 20px",
    fontSize: 16,
    alignItems: "center",
    display: "flex",
    color: colors.toggle.commentText,
    columnGap: "8px",
    fontWeight: 500,
  },
  withBounty: {
    padding: "10px 16px",
  },
  bountyItem: {
    padding: "10px 16px",
    color: colors.toggle.bountyText,
  },
});

export default CommentToggle;
