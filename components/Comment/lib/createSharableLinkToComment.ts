import { Comment as CommentType } from "./types";
import copyTextToClipboard from "~/config/utils/copyTextToClipboard";

const createSharableLinkToComment = (comment: CommentType) => {

  let _root: CommentType | undefined = comment;
  let threadId: string | undefined = undefined;
  while (_root) {
    if (_root?.thread?.id) {
      threadId = String(_root.thread.id);
      break;
    }

    _root = _root?.parent;
    console.log('iteration')
  }


  const url = new URL(window.location.href);
  url.hash = `#threadId=${threadId}`;

  copyTextToClipboard(url.href);
  return url;
};

export default createSharableLinkToComment;
