import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

type Args = {
  unifiedDocumentId: ID;
  onError: Function;
  onSuccess: Function;
};

export default function restoreDocument({
  unifiedDocumentId,
  onError,
  onSuccess,
}: Args): void {
  fetch(
    API.RESTORE_DOC({ documentId: unifiedDocumentId }),
    API.PATCH_CONFIG({ is_removed: false })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((_res) => onSuccess())
    .catch((error: Error) => {
      captureEvent({
        error,
        msg: "Failed to restore document",
        data: { unifiedDocumentId },
      });
      onError(error)
    });
}
