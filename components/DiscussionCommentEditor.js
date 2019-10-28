import { useEffect, useRef, useState, Fragment } from "react";

import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

import TextEditor from "~/components/TextEditor";

import DiscussionActions from "~/redux/discussion";

import colors, { discussionPageColors } from "~/config/themes/colors";
import {
  currentUserHasMinimumReputation,
  doesNotExist,
  getMinimumReputation,
} from "~/config/utils";
import { ModalActions } from "../redux/modals";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";

const DiscussionCommentEditor = (props) => {
  const { commentId, postMethod, onSubmit, getRef, setRef } = props;

  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();

  const minimumReputation = getMinimumReputation(
    store.getState(),
    "CreateDiscussionThread"
  );
  const [isActive, setIsActive] = useState(props.active);

  useEffect(() => {
    setIsActive(props.active);
  }, [props.active]);

  const { paperId, discussionThreadId } = router.query;

  const post = async (text) => {
    return await postMethod(
      { dispatch, store, paperId, discussionThreadId, commentId, onSubmit },
      text
    );
  };

  function onClick() {
    if (currentUserHasMinimumReputation(store.getState(), minimumReputation)) {
      setIsActive(true);
    } else {
      ModalActions.openPermissionNotificationModal(true, "create a thread");
    }
  }

  function onCancel(e) {
    e && e.stopPropagation();
    setIsActive(false);
    props.onCancel();
  }

  return (
    <div
      className={css(
        styles.commentBoxContainer,
        isActive && styles.activeCommentBoxContainer
      )}
      onClick={!isActive ? onClick : null}
      ref={getRef}
    >
      <TextEditor
        canEdit={true}
        canSubmit={true}
        onSubmit={post}
        readOnly={!isActive}
        commentEditor={true}
        onCancel={onCancel}
      />
    </div>
  );
};

export const CommentEditor = (props) => {
  const { onSubmit } = props;

  const [active, setActive] = useState(false);
  const containerRef = useRef(null);

  // detectOutsideClick(containerRef);

  // function detectOutsideClick(ref) {
  //   function handleClickOutside(event) {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       setTimeout(() => {
  //         setActive(false);
  //       }, 100);
  //     }
  //   }

  //   useEffect(() => {
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   });
  // }

  function hideReply() {
    setActive(false);
  }

  return (
    <PermissionNotificationWrapper
      modalMessage="post a comment"
      permissionKey="CreateDiscussionComment"
      onClick={null}
      styling={styles.notificationWrapper}
    >
      <DiscussionCommentEditor
        active={active}
        getRef={containerRef}
        onSubmit={onSubmit}
        postMethod={postComment}
        commentEditor={true}
        onCancel={hideReply}
      />
    </PermissionNotificationWrapper>
  );
};

export const ReplyEditor = (props) => {
  const { commentId, onSubmit, onCancel } = props;

  const [reply, setReply] = useState(false);
  const [transition, setTransition] = useState(false);
  const containerRef = useRef(null);

  // detectOutsideClick(containerRef);

  // function detectOutsideClick(ref) {
  //   function handleClickOutside(event) {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       hideReply();
  //     }
  //   }

  //   useEffect(() => {
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   });
  // }

  function showReply(e) {
    e.stopPropagation();
    setTransition(true);
    setReply(true);
  }

  function hideReply(e) {
    e && e.stopPropagation();
    setTimeout(() => {
      setTransition(false);
      setTimeout(() => {
        setReply(false);
      }, 280);
    }, 100);
  }

  // function setRef(reference) {
  //   setEditorRef(reference);
  // }

  return (
    <div className={css(styles.actionBar, transition && styles.reveal)}>
      {!reply ? (
        <div className={css(styles.replyContainer)}>
          <PermissionNotificationWrapper
            onClick={showReply}
            modalMessage="post a reply"
            permissionKey="CreateDiscussionReply"
          >
            <div className={css(styles.reply)} id="reply">
              Reply
            </div>
          </PermissionNotificationWrapper>
        </div>
      ) : (
        <DiscussionCommentEditor
          active={true}
          // setRef={setRef}
          getRef={containerRef}
          onSubmit={onSubmit}
          postMethod={postReply}
          commentId={commentId}
          commentEditor={true}
          onCancel={hideReply}
        />
      )}
    </div>
  );
};

async function postComment(props, text) {
  const { dispatch, store, paperId, discussionThreadId, onSubmit } = props;

  dispatch(DiscussionActions.postCommentPending());
  await dispatch(
    DiscussionActions.postComment(paperId, discussionThreadId, text)
  );

  const comment = store.getState().discussion.postedComment;
  // TODO: Check for success first
  onSubmit(comment);
  return !doesNotExist(comment);
}

async function postReply(props, text) {
  const {
    dispatch,
    store,
    paperId,
    discussionThreadId,
    commentId,
    onSubmit,
  } = props;

  dispatch(DiscussionActions.postReplyPending());
  await dispatch(
    DiscussionActions.postReply(paperId, discussionThreadId, commentId, text)
  );

  const reply = store.getState().discussion.postedReply;
  // TODO: Check for success first
  onSubmit(reply);
  return !doesNotExist(reply);
}

const styles = StyleSheet.create({
  threadContainer: {
    width: "80%",
    padding: "30px 0px",
    margin: "auto",
  },
  actionBar: {
    marginTop: 8,
    height: 19,
    width: "100%",
    transition: "all ease-in-out 0.3s",
    overflow: "hidden",
  },
  reveal: {
    height: 240,
  },
  threadTitle: {
    width: "100%",
    fontSize: 33,
  },
  body: {
    marginBottom: 28,
    marginTop: 14,
    fontSize: 16,
    lineHeight: "24px",
  },
  replyContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  reply: {
    textTransform: "uppercase",
    cursor: "pointer",
    fontSize: 13,
    marginBottom: 10,
    ":hover": {
      color: "#000",
    },
  },
  contentContainer: {
    width: "70%",
    padding: "30px 0px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  shareContainer: {
    background: colors.LIGHT_GREY(),
    color: colors.GREY(),
    height: "46px",
    width: "46px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  allCommentsContainer: {
    width: "100%",
  },
  commentContainer: {
    // padding: "30px 30px 36px 30px",
  },
  commentInfo: {
    color: colors.BLACK(0.8),
  },
  commentBoxContainer: {
    width: "100%",
    transition: "all ease-in-out 0.3s",
  },
  activeCommentBoxContainer: {
    height: 231,
  },
  divider: {
    borderBottom: "1px solid",
    display: "block",
    borderColor: discussionPageColors.DIVIDER,
  },
  notificationWrapper: {
    width: "100%",
  },
});
