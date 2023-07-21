import { Comment as CommentType } from "./types";
import copyTextToClipboard from "~/config/utils/copyTextToClipboard";

const createSharableLinkToComment = (comment: CommentType) => {
  const url = new URL(window.location.href);
  const threadId = comment.thread.id ?? comment.parent?.thread.id;

  url.hash = `#threadId=${threadId}`;

  copyTextToClipboard(url.href);
  return url;
};

export default createSharableLinkToComment;
