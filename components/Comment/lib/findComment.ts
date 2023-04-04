import { ID } from "~/config/types/root_types";
import { Comment } from "./types";

type FoundComment = {
  comment: Comment;
  path: Array<ID>;
};

type findArgs = {
  id?: ID;
  comment: Comment;
  conditions?: Array<{key: string, value: any}>,
  path?: Array<ID>;
};

type findCommentArgs = {
  id?: ID;
  comments: Comment[];
  conditions?: Array<{key: string, value: any}>,
};

const _find = ({
  id,
  comment,
  conditions,
  path = [],
}: findArgs): FoundComment | undefined => {
  if (conditions) {
    const isSatisfied = conditions.reduce((satisfied: boolean, cond:any) => satisfied && comment[cond.key] === cond.value, true);
    if (isSatisfied) {
      return {
        comment,
        path: [...path, id],
      };      
    }
  }
  else if (comment.id === id) {
    return {
      comment,
      path: [...path, id],
    };
  }
  for (let i = 0; i < comment.children.length; i++) {
    const child = comment.children[i];
    const found = _find({ id, comment: child, conditions, path: [...path, comment.id] });

    if (found) {
      return found;
    }
  }
};

const findComment = ({
  id,
  conditions,
  comments,
}: findCommentArgs): FoundComment | undefined => {
  for (let i = 0; i < comments.length; i++) {
    const found = _find({ id, comment: comments[i], conditions });

    if (found) {
      return found;
    }
  }
};

export const findAllComments = ({
  id,
  conditions,
  comments,
}: findCommentArgs): FoundComment[] => {
  const found:FoundComment[] = []
  for (let i = 0; i < comments.length; i++) {
    const c = _find({ id, comment: comments[i], conditions });

    if (c) {
      found.push(c);
    }
  }

  return found;
};

export default findComment;
