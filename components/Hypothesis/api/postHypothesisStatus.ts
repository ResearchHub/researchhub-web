import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";

type PostHypoStatusArgs = {
  hypoUniDocID: ID;
  onError: Function;
  onSuccess: Function;
};

export function restoreHypothesis({
  hypoUniDocID,
  onError,
  onSuccess,
}: PostHypoStatusArgs): void {
  fetch(
    API.RESTORE_DOC({ documentId: hypoUniDocID }),
    API.PATCH_CONFIG({ is_removed: false })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((_res) => onSuccess())
    .catch((error: Error) => onError(error));
}

export function removeHypothesis({
  hypoUniDocID,
  onError,
  onSuccess,
}: PostHypoStatusArgs): void {
  fetch(
    API.CENSOR_DOC({ documentId: hypoUniDocID }),
    API.PATCH_CONFIG({ is_removed: true })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((_res) => onSuccess())
    .catch((error: Error) => onError(error));
}
