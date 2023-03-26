import { Comment } from "./types";

type replaceCommentArgs = {
  prev: Comment;
  next: Comment;
  list: Comment[];
};

const replaceComment = ({ prev, next, list }: replaceCommentArgs) => {
  // Preserve the children of the updated comment since backend will not return
  // a list of children upon update.
  next.children = prev.children;
  next.parent = prev.parent;

  // The strategy is to update the entire comment object through the parent.
  // This way, react will re-render properly.
  if (prev.parent) {
    const idx = prev.parent.children.findIndex((child) => child.id === prev.id);
    prev.parent.children[idx] = next;
  } else {
    console.log('no parent')
    const idx = list.findIndex((child) => child.id === prev.id);
    list[idx] = next;
  }
};

export default replaceComment;
