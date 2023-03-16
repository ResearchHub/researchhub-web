import moduleColors from "~/components/Comment/lib/colors";
import CommentFeed from "~/components/Comment/CommentFeed";
import { css, StyleSheet } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import config from "./lib/config";
import { TopLevelDocument } from "~/config/types/root_types";

type Args = {
  isOpen: boolean;
  setIsOpen: Function;
  document: TopLevelDocument;
};

const CommentSidebar = ({ isOpen, setIsOpen, document }: Args) => {
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
          <IconButton onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </div>
        <CommentFeed document={document} />
      </div>
    </div>
  );
};

const slideOpenKeyframe = {
  "0%": {
    marginRight: -config.sidebar.width,
  },

  "100%": {
    marginRight: 0,
  },
};

const slideCloseKeyframe = {
  "0%": {
    marginRight: 0,
  },

  "100%": {
    marginRight: -config.sidebar.width,
  },
};

const styles = StyleSheet.create({
  sidebar: {
    boxShadow: "8px 30px 30px rgba(21, 21, 21, 0.2)",
    borderLeft: `1px solid ${moduleColors.border}`,
    borderBottom: `1px solid ${moduleColors.border}`,
    position: "sticky",
    top: 0,
    width: config.sidebar.width,
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
    animationName: [slideOpenKeyframe],
    animationDuration: "0.5s",
    animationDirection: "normal",
    animationFillMode: "forwards",
    animationTiming: "ease-in",
  },
  sidebarClosed: {
    animationName: [slideCloseKeyframe],
    animationDuration: "0.5s",
    animationDirection: "normal",
    animationFillMode: "forwards",
    animationTiming: "ease-out",
  },
});

export default CommentSidebar;
