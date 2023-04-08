import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moduleColors from "~/components/Comment/lib/colors";
import { css, StyleSheet } from "aphrodite";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import CommentSidebarToggle from "./CommentSidebarToggle";
import { useEffect, useState } from "react";
import { Comment } from "./lib/types";
import config from "./lib/config";
import colors from "~/config/themes/colors";

type Args = {
  children: any;
  totalCommentCount: number;
  isInitialFetchDone: boolean;
};

const CommentSidebar = ({
  children,
  totalCommentCount,
  isInitialFetchDone = false,
}: Args) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isInFixedPosRange, setIsInFixedPosRange] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= config.sidebar.fixedPosMaxWidth) {
        setIsInFixedPosRange(true);
      }
      else {
        setIsInFixedPosRange(false);
      }
    }

    if (window.innerWidth <= config.sidebar.fixedPosMaxWidth) {
      setIsInFixedPosRange(true);
      setIsOpen(false);
    }

    window.addEventListener("resize", handleResize);

    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, [])

  return (
    <>
      <div
        className={css(
          styles.sidebar,
          isOpen ? styles.sidebarOpen : styles.sidebarClosed,
          isInFixedPosRange && isOpen && styles.sidebarFixedOpen,
        )}
      >
        <div className={css(styles.feedWrapper)}>
          {isInitialFetchDone && (
            <CommentSidebarToggle
              isOpen={isOpen}
              setIsOpen={(isOpen) => {
                setIsOpen(isOpen);
              }}
              bountyAmount={0}
              commentCount={totalCommentCount}
            />
          )}
          <div className={css(styles.sidebarHeader)}>
            <div style={{display: "flex", alignItems: "center"}}>
              Conversation
              {isInitialFetchDone && (
                <span className={css(styles.discussionCount)}>
                  {totalCommentCount}
                </span>
              )}
            </div>
            <IconButton
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    boxShadow: "8px 30px 30px rgba(21, 21, 21, 0.2)",
    borderLeft: `1px solid ${moduleColors.border}`,
    borderBottom: `1px solid ${moduleColors.border}`,
    position: "sticky",
    top: 0,
    boxSizing: "border-box",
    padding: "25px 0px",
    [`@media only screen and (max-width: ${config.sidebar.fixedPosMaxWidth}px)`]: {
      display: "none"
    },    
  },
  sidebarHeader: {
    fontWeight: 500,
    marginBottom: 25,
    fontSize: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 25px",
  },
  feedWrapper: {
    overflowY: "scroll",
    height: "90vh",
    paddingBottom: "10vh",
  },
  sidebarOpen: {
    width: 500,
    [`@media only screen and (max-width: 1600px)`]: {
      width: 420,
    },
  },
  discussionCount: {
    background: colors.LIGHTER_GREY(),
    borderRadius: "4px",
    padding: "5px 10px",
    fontSize: 14,
    fontWeight: 500,
    marginLeft: 10,
    alignSelf: "center",
  },  
  sidebarClosed: {
    width: 0,
  },
  sidebarFixedOpen: {
    [`@media only screen and (max-width: ${config.sidebar.fixedPosMaxWidth}px)`]: {
      display: "block",
      width: 500,
      position: "fixed",
      right: 0,
      top: 0,
      zIndex: 999999,
      background: "white",
    },    
  },
});

export default CommentSidebar;
