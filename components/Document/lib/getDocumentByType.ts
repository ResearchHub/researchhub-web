import { fetchPaper } from "~/components/Paper/lib/api";

export const getDocumentByType = async ({ documentType, documentId }) => {
  switch (documentType) {
    case "paper":
      return fetchPaper({ paperId: documentId });
    default:
      throw new Error(`Invalid document type. Type was ${documentType}`);
  }
};
