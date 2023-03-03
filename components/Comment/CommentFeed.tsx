import { useEffect, useState } from "react";
import Comment from "./Comment";
import { Comment as CommentType } from "./lib/types";
import CommentEditor from "~/components/Comment/CommentEditor";
import { createCommentAPI, updateCommentAPI, fetchCommentsAPI } from "./lib/api";
import { ID } from "~/config/types/root_types";

type Args = {
  unifiedDocumentId: ID;
}

const CommentFeed = ({ unifiedDocumentId }: Args) => {
  
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const _fetchComments = () => {
      setIsFetching(true);
      fetchCommentsAPI({ unifiedDocumentId })
      .then((comments: CommentType[]) => {
        setComments(comments);
        setIsFetching(false);
      });
    }

    _fetchComments();
  }, [unifiedDocumentId]);

  const handleCommentCreate = ({ content, postType }) => {
    createCommentAPI({ content, postType })
      .then((comment:CommentType) => {
        setComments([comment, ...comments])
      })
  }

  const handleCommentUpdate = ({ comment, content }: { comment: CommentType, content: any }) => {
    updateCommentAPI({ id: comment.id, content })
      .then((comment:CommentType) => {
        const updatedIdx = comments.findIndex((c, idx) => c.id === comment.id);
        const updatedComments = [...comments];
        updatedComments[updatedIdx] = comment;
        setComments(updatedComments);
      });
  }

  return (
    <div>
      <CommentEditor
        previewWhenInactive={true}
        handleSubmit={handleCommentCreate}
      />
      {comments.map(c => <Comment handleCreate={handleCommentCreate} handleUpdate={handleCommentUpdate} key={c.id} comment={c} />)}
    </div>
  )
}

export default CommentFeed;