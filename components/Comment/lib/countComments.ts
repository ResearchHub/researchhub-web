import { Comment } from "./types";

const _countComments = ({ comment }: { comment: Comment }) => {
  let count = 0;
  if (comment.children.length === 0) {
    return 0;
  } else {
    for (let i = 0; i < comment.children.length; i++) {
      const child = comment.children[i];
      if (child) {
        count += 1 + _countComments({ comment: child });
      }
      break;
    }
  }
  return count;
};

const countComments = ({ comments }: { comments: Comment[] }): number => {
  let count = 0;
  for (let i = 0; i < comments.length; i++) {
    count += 1 + _countComments({ comment: comments[i] });
  }

  return count;
};

export default countComments;
