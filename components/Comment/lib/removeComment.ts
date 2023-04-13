import { Comment } from "./types";

type removeCommentArgs = {
  comment: Comment;
  list: Comment[];
};

const removeComment = ({ comment, list }: removeCommentArgs) => {
  // The strategy is to update the entire comment object through the parent.
  // This way, react will re-render properly.
  if (comment.parent) {
    const idx = comment.parent.children.findIndex(
      (child) => child.id === comment.id
    );
    comment.parent.children.splice(idx, 1);
  } else {
    const idx = list.findIndex((child) => child.id === comment.id);
    list.splice(idx, 1);
  }
};

export default removeComment;
