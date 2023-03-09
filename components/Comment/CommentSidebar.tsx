import moduleColors from "~/components/Comment/lib/colors";
import CommentFeed from "~/components/Comment/CommentFeed";
import { css, StyleSheet } from "aphrodite";

type Args = {
  isOpen: boolean;
}

const CommentSidebar = ({ isOpen }: Args) => {

  return (
    <div className={css(styles.sidebar, isOpen ? styles.sidebarOpen : styles.sidebarClosed)}>
      <div style={{ overflowY: "scroll", height: "100vh" }}>
        <CommentFeed unifiedDocumentId={5555} />
      </div>
    </div>
  )
}

const slideoutKeyframe = {
  '0%': {
    transform: 'translateX(0%)',
  },

  '100%': {
    transform: 'translateX(-100%)',
  },
}

const styles = StyleSheet.create({
  sidebar: {
    background: moduleColors.sidebar.background,
    borderLeft: `1px solid ${moduleColors.border}`,
    borderBottom: `1px solid ${moduleColors.border}`,
    position: "sticky",
    top: 0,
    right: 0,
    paddingRight: 32,
    paddingLeft: 32,
    width: "400px",
  },
  sidebarOpen: {

  },
  sidebarClosed: {
    animationName: [slideoutKeyframe],
    animationDuration: '1s, 100ms',
    // animationIterationCount: 'forwards',    
  }
});

export default CommentSidebar;