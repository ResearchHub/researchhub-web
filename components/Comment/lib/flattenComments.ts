import { Comment as CommentType } from "../lib/types";

export default function flattenComments(comments: CommentType[]): {
  comments: CommentType[];
  childCount: number;
} {
  const flattenedComments: CommentType[] = [];
  let childCount = 0;

  function walkThrough(comment: CommentType) {
    flattenedComments.push(comment);

    if (comment.children) {
      comment.children.forEach(walkThrough);
      childCount += comment.children.length;
    }
  }

  comments.forEach(walkThrough);
  return { comments: flattenedComments, childCount };
}
