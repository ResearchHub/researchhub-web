import { ID } from "~/config/types/root_types";
import { Comment } from "./types";

type FoundComment = {
  comment: Comment;
  path: Array<ID>;
};

type findArgs = {
  id: ID;
  comment: Comment;
  path?: Array<ID>;
};

type findCommentArgs = {
  id: ID;
  comments: Comment[];
};

const _find = ({
  id,
  comment,
  path = [],
}: findArgs): FoundComment | undefined => {
  if (comment.id === id) {
    return {
      comment,
      path: [...path, id],
    };
  }
  for (let i = 0; i < comment.children.length; i++) {
    const child = comment.children[i];
    const found = _find({ id, comment: child, path: [...path, comment.id] });

    if (found) {
      return found;
    }
  }
};

const findComment = ({
  id,
  comments,
}: findCommentArgs): FoundComment | undefined => {
  for (let i = 0; i < comments.length; i++) {
    const found = _find({ id, comment: comments[i] });

    if (found) {
      return found;
    }
  }
};

export default findComment;
