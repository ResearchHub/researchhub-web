import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moduleColors from "~/components/Comment/lib/colors";
import { css, StyleSheet } from "aphrodite";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import { useEffect, useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import colors from "~/config/themes/colors";

type Args = {
  children: any;
  isOpen: boolean;
  handleClose: Function;
};

const CommentDrawer = ({ children, isOpen = false, handleClose }: Args) => {
  const [drawerEl, setDrawerEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setDrawerEl(document.body);
  }, []);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <SwipeableDrawer
        container={drawerEl}
        anchor="bottom"
        open={isOpen}
        onClose={() => handleClose()}
        onOpen={() => null}
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
            </div>
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>

          {children}
        </div>
      </SwipeableDrawer>
    </div>
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
    backgroundColor: colors.PURE_GRAY(),
    borderRadius: 3,
    position: "absolute",
    top: 8,
    left: "calc(50% - 15px)",
  },
  sidebar: {
    boxShadow: `8px 30px 30px ${colors.MOSTLY_BLACK_GREY(0.2)}`,
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
