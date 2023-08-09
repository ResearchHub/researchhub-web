import fetchPaper from "../api/fetchPaper";
import fetchPost from "../api/fetchPost";

export const fetchDocumentByType = async ({ documentType, documentId }) => {
  switch (documentType) {
    case "paper":
      return fetchPaper({ paperId: documentId });
    case "post":
      return fetchPost({ postId: documentId });
    default:
      // FIXME: Log to sentry
      throw new Error(`Invalid document type. Type was ${documentType}`);
  }
};
