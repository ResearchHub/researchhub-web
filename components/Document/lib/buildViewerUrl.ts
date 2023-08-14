import { ID, RhDocumentType } from "~/config/types/root_types";

interface Props {
  documentType?: RhDocumentType;
  documentId?: ID;
  threadId?: ID;
  serializedSelection?: any;
  citationId?: ID;
}

const buildViewerUrl = ({
  documentId,
  documentType,
  threadId,
  citationId,
  serializedSelection,
}: Props): URL => {
  const url =
    typeof window !== "undefined"
      ? new URL(window.location.host + "/viewer")
      : new URL((process.env.HOST || "") + "/viewer");

  if (documentId) {
    url.searchParams.set("docId", String(documentId));
  }
  if (documentType) {
    url.searchParams.set("docType", documentType);
  }
  if (citationId) {
    url.searchParams.set("citationId", String(citationId));
  }
  if (threadId) {
    url.hash = `#threadId=${threadId}`;
  }
  if (serializedSelection) {
    url.hash = `#selection=${serializedSelection}`;
  }

  return url;
};

export default buildViewerUrl;
