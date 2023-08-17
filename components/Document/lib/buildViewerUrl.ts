import { ID, RhDocumentType } from "~/config/types/root_types";

interface Props {
  contentType: RhDocumentType;
  contentId: ID;
  threadId?: ID;
  serializedSelection?: any;
}

const buildViewerUrl = ({
  contentId,
  contentType,
  threadId,
  serializedSelection,
}: Props): URL => {
  const url =
    typeof window !== "undefined"
      ? new URL(window.location.host + "/viewer")
      : new URL((process.env.HOST || "") + "/viewer");

  url.searchParams.set("contentId", String(contentId));
  url.searchParams.set("contentType", contentType);

  if (threadId) {
    url.hash = `#threadId=${threadId}`;
  }
  if (serializedSelection) {
    url.hash = `#selection=${serializedSelection}`;
  }

  return url;
};

export default buildViewerUrl;
