import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moduleColors from "~/components/Comment/lib/colors";
import { css, StyleSheet } from "aphrodite";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import CommentToggle from "./CommentToggle";
import { useEffect, useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import colors from "~/config/themes/colors";

type Args = {
  children: any;
  isInitialFetchDone: boolean;
  totalCommentCount: number;
};

const CommentDrawer = ({
  children,
  totalCommentCount,
  isInitialFetchDone,
}: Args) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerEl, setDrawerEl] = useState<null | HTMLElement>(null);
  // const openBountyAmount = comments.reduce(
  //   (total, comment) => total + getBountyAmount({ comment }),
  //   0
  // );

  useEffect(() => {
    setDrawerEl(document.body);
  }, []);

  return (
    <>
      {isInitialFetchDone && (
        <CommentToggle
          isOpen={isOpen}
          setIsOpen={(isOpen) => {
            setIsOpen(isOpen);
          }}
          bountyAmount={0}
          commentCount={totalCommentCount}
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
            <div style={{ display: "flex", alignItems: "center" }}>
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
      </SwipeableDrawer>
    </>
  );
};

const styles = StyleSheet.create({
  drawerRoot: {},
  drawerContentWrapper: {
    height: "100%",
    overflow: "auto",
    padding: "15px 0px",
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
    marginBottom: 25,
    padding: "15px 25px",
  },
});

export default CommentDrawer;
