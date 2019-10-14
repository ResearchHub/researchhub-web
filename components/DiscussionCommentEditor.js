import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

import TextEditor from "~/components/TextEditor";

import DiscussionActions from "~/redux/discussion";

import colors, { discussionPageColors } from "~/config/themes/colors";
import { deserializeEditor } from "~/config/utils";

const DiscussionCommentEditor = (props) => {
  const { postMethod, onSubmit, text } = props;

  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const { paperId, discussionThreadId } = router.query;
  const { commentId } = props;

  const [active, setActive] = useState(false);

  const post = async (text) => {
    await postMethod(
      { dispatch, store, paperId, discussionThreadId, commentId, onSubmit },
      text
    );
  };

  function detectOutsideClick(ref) {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setTimeout(() => {
          setActive(false);
        }, 100);
      }
    }

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    });
  }

  const containerRef = useRef(null);
  detectOutsideClick(containerRef);

  return (
    <div
      className={css(
        styles.commentBoxContainer,
        active && styles.activeCommentBoxContainer
      )}
      onClick={() => setActive(true)}
      ref={ref}
    >
      <TextEditor
        canEdit={true}
        canSubmit={true}
        onSubmit={post}
        readOnly={!active}
        commentEditor={true}
        initialValue={text}
      />
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
  onSubmit(comment);
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
  onSubmit(reply);
}

export const CommentEditor = (props) => {
  const { onSubmit } = props;
  return (
    <DiscussionCommentEditor onSubmit={onSubmit} postMethod={postComment} />
  );
};

export const ReplyEditor = (props) => {
  const { commentId, onSubmit } = props;
  return (
    <DiscussionCommentEditor
      onSubmit={onSubmit}
      postMethod={postReply}
      commentId={commentId}
    />
  );
};

const ReplyTextEditor = (props) => {
  const [reply, setReply] = useState(false);
  const [transition, setTransition] = useState(false);

  function detectOutsideClick(ref) {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setTimeout(() => {
          setTransition(false);
          setTimeout(() => {
            setReply(false);
          }, 280);
        }, 100);
      }
    }

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    });
  }

  function showReply(e) {
    e.stopPropagation();
    setTransition(true);
    setReply(true);
  }

  const textEditorRef = useRef(null);
  detectOutsideClick(textEditorRef);

  return (
    <div className={css(styles.actionBar, transition && styles.reveal)}>
      {!reply ? (
        <div className={css(styles.replyContainer)}>
          <div className={css(styles.reply)} onClick={showReply} id="reply">
            Reply
          </div>
        </div>
      ) : (
        <div ref={textEditorRef}>
          <TextEditor canEdit={true} commentEditor={true} />
        </div>
      )}
    </div>
  );
};

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
    justifyContent: "flex-start",
  },
  reply: {
    cursor: "pointer",
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
});
