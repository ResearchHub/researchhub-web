import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import VoteWidget from "~/components/VoteWidget";
// import ThreadActionBar from "./ThreadActionBar";
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";

// Redux
import DiscussionActions from "~/redux/discussion";
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { checkVoteTypeChanged, getNestedValue } from "~/config/utils";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { createUsername } from "../../../config/utils";

const InlineComment = (props) => {
  const { auth } = props;
  // const {
  //   data,
  //   metaData,
  //   username,
  //   authorProfile,
  //   fetching,
  //   threadPath,
  //   dropDownEnabled,
  //   toggleEdit,
  //   twitter,
  //   twitterUrl,
  //   onRemove,
  //   onHideClick,
  //   smaller,
  //   hideHeadline,
  //   containerStyle,
  // } = props;

  return (
    <div className={css(styles.root)}>
      <DiscussionPostMetadata
        authorProfile={auth.user.author_profile}
        username={"Joshua Lee"}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    background: "#FFF",
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
