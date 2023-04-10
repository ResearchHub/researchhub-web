import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type Args = {
  setIsOpen: Function;
  isOpen: boolean;
  bountyAmount: number;
  commentCount: number;
};

const CommentSidebarToggle = ({
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

  const [mountEl, setMountEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!mountEl) {
      const _mountEl = document.body;
      setMountEl(_mountEl);
    }
  }, []);

  return (
    <>
      {mountEl &&
        createPortal(
          <div
            className={css(styles.toggle)}
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

const styles = StyleSheet.create({
  toggle: {
    position: "fixed",
    left: "50%",
    bottom: 15,
    alignItems: "center",
    display: "flex",
    transform: "translate(-50%, -50%)",
    zIndex: 1000000,
    borderRadius: 100,
    minWidth: 70,
    background: "white",
    cursor: "pointer",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
    userSelect: "none",
    border: `1px solid ${colors.border}`,
    ":hover": {
      background: colors.hover.background,
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

export default CommentSidebarToggle;
