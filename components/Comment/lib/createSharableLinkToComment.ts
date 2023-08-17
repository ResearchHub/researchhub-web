import {
  COMMENT_CONTEXTS,
  CommentThread,
  Comment as CommentType,
} from "./types";
import copyTextToClipboard from "~/config/utils/copyTextToClipboard";
import buildViewerUrl from "~/components/Document/lib/buildViewerUrl";
import { ID, RhDocumentType } from "~/config/types/root_types";

interface Props {
  comment: CommentType;
  context: COMMENT_CONTEXTS;
}

const createSharableLinkToComment = ({
  comment,
  context = COMMENT_CONTEXTS.GENERIC,
}: Props) => {
  let url: URL;
  if (context === COMMENT_CONTEXTS.REF_MANAGER) {
    url = buildViewerUrl({
      contentType: comment.thread.relatedContent.type,
      contentId: comment.thread.relatedContent.id,
      threadId: comment.thread.id,
    });
  } else {
    url = new URL(window.location.href);
    url.hash = `#threadId=${comment.thread.id}`;
  }

  copyTextToClipboard(url.href);
  return url;
};

export default createSharableLinkToComment;
