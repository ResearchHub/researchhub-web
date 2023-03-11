import moduleColors from "~/components/Comment/lib/colors";
import CommentFeed from "~/components/Comment/CommentFeed";
import { css, StyleSheet } from "aphrodite";

type Args = {
  isOpen: boolean;
}

const WIDTH = 450;

const CommentSidebar = ({ isOpen }: Args) => {

  return (
    <div className={css(styles.sidebar, isOpen ? styles.sidebarOpen : styles.sidebarClosed)}>
      <div className={css(styles.feedWrapper)}>
        <CommentFeed unifiedDocumentId={5555} />
      </div>
    </div>
  )
}

const slideOpenKeyframe = {
  '0%': {
    marginRight: -WIDTH,
  },

  '100%': {
    marginRight: 0,
  },
}

const slideCloseKeyframe = {
  '0%': {
    marginRight: 0,
  },

  '100%': {
    marginRight: -WIDTH,
  },
}

const styles = StyleSheet.create({
  sidebar: {
    background: moduleColors.sidebar.background,
    borderLeft: `1px solid ${moduleColors.border}`,
    borderBottom: `1px solid ${moduleColors.border}`,
    position: "sticky",
    top: 0,
    paddingRight: 32,
    paddingLeft: 32,
    width: WIDTH,
    boxSizing: "border-box",
  },
  feedWrapper: {
    overflowY: "scroll",
    height: "100vh",
  },
  sidebarOpen: {
    animationName: [slideOpenKeyframe],
    animationDuration: '0.5s',
    animationDirection: "normal",
    animationFillMode: "forwards",
    animationTiming: "ease-in",
  },
  sidebarClosed: {
    animationName: [slideCloseKeyframe],
    animationDuration: '0.5s',
    animationDirection: "normal",
    animationFillMode: "forwards",
    animationTiming: "ease-out",
  }
});

export default CommentSidebar;