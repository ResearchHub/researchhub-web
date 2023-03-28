import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moduleColors from "~/components/Comment/lib/colors";
import { css, StyleSheet } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import config from "./lib/config";
import CommentSidebarToggle from "./CommentSidebarToggle";
import { useMemo, useState } from "react";
import { Comment } from "./lib/types";
import { getBountyAmount } from "./lib/bounty";
import countComments from "./lib/countComments";

type Args = {
  children: any;
  comments: Comment[];
  setReadyForInitialRender: Function;
  isInitialFetchDone: boolean;
};

const CommentSidebar = ({
  children,
  comments,
  setReadyForInitialRender,
  isInitialFetchDone = false,
}: Args) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openBountyAmount = comments.reduce(
    (total, comment) => total + getBountyAmount({ comment }),
    0
  );
  const commentCount = useMemo(() => countComments({ comments }), [comments]);

  return (
    <div
      className={css(
        styles.sidebar,
        isOpen ? styles.sidebarOpen : styles.sidebarClosed
      )}
    >
      <div className={css(styles.feedWrapper)}>
        <div className={css(styles.sidebarHeader)}>
          Activity
          <IconButton
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </div>
        {isInitialFetchDone && (
          <CommentSidebarToggle
            isOpen={isOpen}
            setIsOpen={(isOpen) => {
              setIsOpen(isOpen);
              setReadyForInitialRender(true);
            }}
            bountyAmount={openBountyAmount}
            commentCount={commentCount}
          />
        )}
        {children}
      </div>
    </div>
  );
};

// FIXME: Figure out whether to animate or not
// const slideOpenKeyframe = {
//   "0%": {
//     // marginRight: -config.sidebar.width,
//     width: 0
//   },

//   "100%": {
//     // marginRight: 0,
//     width: config.sidebar.width
//   },
// };

// const slideCloseKeyframe = {
//   "0%": {
//     width: config.sidebar.width
//   },

//   "100%": {
//     width: 0
//   },
// };

const styles = StyleSheet.create({
  sidebar: {
    boxShadow: "8px 30px 30px rgba(21, 21, 21, 0.2)",
    borderLeft: `1px solid ${moduleColors.border}`,
    borderBottom: `1px solid ${moduleColors.border}`,
    position: "sticky",
    top: 0,

    boxSizing: "border-box",
  },
  sidebarHeader: {
    fontWeight: 500,
    fontSize: 18,
    marginBottom: 25,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedWrapper: {
    padding: "15px 25px",
    overflowY: "scroll",
    height: "100vh",
  },
  sidebarOpen: {
    width: config.sidebar.width,
    // animationName: [slideOpenKeyframe],
    // animationDuration: "0.2s",
    // animationDirection: "normal",
    // animationFillMode: "forwards",
    // animationTiming: "ease-in",
  },
  sidebarClosed: {
    width: 0,
    // animationName: [slideCloseKeyframe],
    // animationDuration: "0.2s",
    // animationDirection: "normal",
    // animationFillMode: "forwards",
    // animationTiming: "ease-out",
  },
});

export default CommentSidebar;
