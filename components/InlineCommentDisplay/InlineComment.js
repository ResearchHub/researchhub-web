// TODO: calvinhlee - this was written by Josh. I need refactor this.
import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import VoteWidget from "~/components/VoteWidget";
import DiscussionPostMetadata from "~/components/Threads/DiscussionPostMetadata";

// Redux
import DiscussionActions from "~/redux/discussion";
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const InlineComment = (props) => {
  const { auth } = props;
  const [showMore, setShowMore] = useState(false);

  const staticString =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

  const renderBlurOverlay = () => {
    if (!showMore) {
      return (
        <Fragment>
          <div className={css(styles.blur)} />
          <div
            className={css(styles.buttonContainer)}
            onClick={() => setShowMore(true)}
          >
            <p className={css(styles.button)}>{"Read More"}</p>
          </div>
        </Fragment>
      );
    }
  };
  return (
    <div className={css(styles.root)}>
      <DiscussionPostMetadata
        authorProfile={auth.user.author_profile}
        data={{ created_by: auth.user }}
        smaller={true}
      />
      <div className={css(styles.container)}>
        <VoteWidget />
        <div className={css(styles.content)}>
          <div className={css(styles.contentBody, showMore && styles.showMore)}>
            {staticString}{" "}
            {/** this will need to be replaced with draft or another editor */}
            {renderBlurOverlay()}
          </div>
          <div className={css(styles.bottomRow)}>
            <div className={css(styles.action, styles.left)}>{"Reply"}</div>
            <div className={css(styles.action)}>{"Comment"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingLeft: 3,
  },
  container: {
    display: "flex",
    alignItems: "flex-start",
    paddingTop: 5,
  },
  contentBody: {
    fontSize: 14,
    lineHeight: 2,
    maxHeight: 100,
    overflow: "hidden",
    position: "relative",
  },
  showMore: {
    overflow: "visible",
    maxHeight: "none",
  },
  blur: {
    background:
      "linear-gradient(180deg, rgba(250, 250, 250, 0) 0%, #FCFCFC 85%)",
    height: "100%",
    position: "absolute",
    zIndex: 3,
    top: 0,
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 5,
    right: 0,
    zIndex: 3,
  },
  button: {
    background: colors.BLUE(),
    color: "#FFF",
    padding: "0px 10px",
    fontSize: 12,
    cursor: "pointer",
    borderRadius: 3,
    ":hover": {
      background: colors.BLUE(),
    },
  },
  bottomRow: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  action: {
    color: colors.BLACK(0.6),
    cursor: "pointer",
    fontSize: 14,
    textDecoration: "underline",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  left: {
    marginRight: 15,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  postComment: DiscussionActions.postComment,
  postCommentPending: DiscussionActions.postCommentPending,
  postUpvotePending: DiscussionActions.postUpvotePending,
  postUpvote: DiscussionActions.postUpvote,
  postDownvotePending: DiscussionActions.postDownvotePending,
  postDownvote: DiscussionActions.postDownvote,
  updateThread: DiscussionActions.updateThread,
  updateThreadPending: DiscussionActions.updateThreadPending,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InlineComment);
