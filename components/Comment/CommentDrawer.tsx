import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moduleColors from "~/components/Comment/lib/colors";
import { css, StyleSheet } from "aphrodite";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import config from "./lib/config";
import CommentSidebarToggle from "./CommentSidebarToggle";
import { useEffect, useMemo, useState } from "react";
import { Comment } from "./lib/types";
import { getBountyAmount } from "./lib/bounty";
import countComments from "./lib/countComments";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

type Args = {
  children: any;
  comments: Comment[];
  isInitialFetchDone: boolean;
};

const CommentDrawer = ({ children, comments, isInitialFetchDone }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerEl, setDrawerEl] = useState<null | HTMLElement>(null);
  const openBountyAmount = comments.reduce(
    (total, comment) => total + getBountyAmount({ comment }),
    0
  );

  const commentCount = 999;

  useEffect(() => {
    setDrawerEl(document.body);
  }, []);

  return (
    <>
      {isInitialFetchDone && (
        <CommentSidebarToggle
          isOpen={isOpen}
          setIsOpen={(isOpen) => {
            setIsOpen(isOpen);
          }}
          bountyAmount={openBountyAmount}
          commentCount={commentCount}
        />
      )}

      <SwipeableDrawer
        container={drawerEl}
        anchor="bottom"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        swipeAreaWidth={50}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            top: 35,
            borderTopLeftRadius: "28px",
            borderTopRightRadius: "28px",
          },
        }}
      >
        <div className={css(styles.pullerBtn)} />
        <div className={css(styles.drawerContentWrapper)}>
          <div className={css(styles.header)}>
            Discussion
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
      </SwipeableDrawer>
    </>
  );
};

const styles = StyleSheet.create({
  drawerRoot: {},
  drawerContentWrapper: {
    height: "100%",
    overflow: "auto",
    padding: 25,
  },
  pullerBtn: {
    width: 30,
    height: 6,
    backgroundColor: "gray",
    borderRadius: 3,
    position: "absolute",
    top: 8,
    left: "calc(50% - 15px)",
  },
  sidebar: {
    boxShadow: "8px 30px 30px rgba(21, 21, 21, 0.2)",
    borderLeft: `1px solid ${moduleColors.border}`,
    borderBottom: `1px solid ${moduleColors.border}`,
    position: "sticky",
    top: 0,
    boxSizing: "border-box",
  },
  header: {
    fontWeight: 500,
    fontSize: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default CommentDrawer;
