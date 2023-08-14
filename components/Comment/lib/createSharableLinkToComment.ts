import { COMMENT_CONTEXTS, Comment as CommentType } from "./types";
import copyTextToClipboard from "~/config/utils/copyTextToClipboard";
import buildViewerUrl from "~/components/Document/lib/buildViewerUrl";
import { ID, RhDocumentType } from "~/config/types/root_types";

interface Props {
  comment: CommentType;
  context?: COMMENT_CONTEXTS;
  documentType?: RhDocumentType;
  documentId?: ID;
  citationId?: ID;
}

const createSharableLinkToComment = ({
  comment,
  documentId,
  citationId,
  documentType,
  context = COMMENT_CONTEXTS.GENERIC,
}: Props) => {
  let url: URL;
  if (context === COMMENT_CONTEXTS.REF_MANAGER) {
    url = buildViewerUrl({
      documentType,
      documentId,
      citationId,
    });
  } else {
    url = new URL(window.location.href);
    url.hash = `#threadId=${comment.thread.id}`;
  }

  copyTextToClipboard(url.href);
  return url;
};

export default createSharableLinkToComment;
