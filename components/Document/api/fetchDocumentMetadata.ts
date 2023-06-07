import { Helpers } from "@quantfive/js-web-config";
import API, { generateApiUrl } from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

interface Props {
  unifiedDocId: ID;
}

const fetchDocumentMetadata = ({
  unifiedDocId,
}: Props): Promise<any> => {
  const url = generateApiUrl(
    `researchhub_unified_document/${unifiedDocId}/get_document_metadata`
  );
  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
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
