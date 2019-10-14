import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

import TextEditor from "~/components/TextEditor";

import DiscussionActions from "~/redux/discussion";

import { deserializeEditor } from "~/config/utils";

const DiscussionCommentEditor = (props) => {
  const { postMethod, onSubmit, text } = props;

  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const { paperId, discussionThreadId } = router.query;
  const { commentId } = props;

  const post = async (text) => {
    await postMethod(
      { dispatch, store, paperId, discussionThreadId, commentId, onSubmit },
      text
    );
  };

  return (
    <TextEditor
      canEdit={true}
      canSubmit={true}
      onSubmit={post}
      commentEditor={true}
      initialValue={text}
    />
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
