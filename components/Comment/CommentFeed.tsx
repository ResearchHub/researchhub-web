import { useEffect, useState } from "react";
import Comment from "./Comment";
import { Comment as CommentType, COMMENT_TYPES } from "./lib/types";
import CommentEditor from "~/components/Comment/CommentEditor";
import {
  createCommentAPI,
  updateCommentAPI,
  fetchCommentsAPI,
} from "./lib/api";
import { ID, parseUser } from "~/config/types/root_types";
import replaceComment from "./lib/replaceComment";
import findComment from "./lib/findComment";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";

type Args = {
  unifiedDocumentId: ID;
};

const CommentFeed = ({ unifiedDocumentId }: Args) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const user = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  useEffect(() => {
    const _fetchComments = async () => {
      setIsFetching(true);
      const comments: CommentType[] = await fetchCommentsAPI({
        unifiedDocumentId,
      });
      setComments(comments);
      setIsFetching(false);
    };

    _fetchComments();
  }, [unifiedDocumentId]);

  const handleCommentCreate = async ({
    content,
    postType,
  }: {
    content: object;
    postType: COMMENT_TYPES;
  }) => {
    const comment: CommentType = await createCommentAPI({ content, postType });
    setComments([comment, ...comments]);
  };

  const handleCommentUpdate = async ({
    comment,
    content,
  }: {
    comment: CommentType;
    content: any;
  }) => {
    const _comment: CommentType = await updateCommentAPI({
      id: comment.id,
      content,
    });
    const found = findComment({ id: comment.id, comments });
    if (found) {
      replaceComment({
        prev: found.comment,
        next: _comment,
        list: comments,
      });
      const updatedComments = [...comments];
      setComments(updatedComments);
    }
  };

  return (
    <div>
      <CommentEditor
        editorId="new-thread"
        handleSubmit={handleCommentCreate}
        allowBounty={true}
        author={user?.authorProfile}
      />
      {comments.map((c) => (
        <Comment
          handleCreate={handleCommentCreate}
          handleUpdate={handleCommentUpdate}
          key={c.id}
          comment={c}
        />
      ))}
    </div>
  );
};

export default CommentFeed;
