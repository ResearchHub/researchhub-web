import { Helpers } from "@quantfive/js-web-config";
import API, { generateApiUrl } from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";
import { parseDocumentMetadata, DocumentMetadata } from "../lib/types";

interface Props {
  unifiedDocId: ID;
}

const fetchDocumentMetadata = ({
  unifiedDocId,
}: Props): Promise<DocumentMetadata> => {
  const url = generateApiUrl(
    `researchhub_unified_document/${unifiedDocId}/get_document_metadata`
  );
  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return parseDocumentMetadata(resp);
    })
    .catch((error) => {
      captureEvent({
        data: { unifiedDocId },
        error,
        msg: `Error fetching document metadata: ${unifiedDocId}`,
      });
      throw error;
    });
};

export default fetchDocumentMetadata;
