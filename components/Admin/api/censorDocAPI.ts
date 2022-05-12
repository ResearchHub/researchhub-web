import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

type Args = {
  unifiedDocumentId: ID;
  onError: Function;
  onSuccess: Function;
};

export default function censorDocument({
  unifiedDocumentId,
  onError,
  onSuccess,
}: Args): void {
  fetch(
    API.CENSOR_DOC({ documentId: unifiedDocumentId }),
    API.PATCH_CONFIG({ is_removed: true })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((_res) => onSuccess())
    .catch((error: Error) => {
      captureEvent({
        error,
        msg: "Failed to censor document",
        data: { unifiedDocumentId },
      });
      onError(error)
    });
}
