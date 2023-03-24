import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";

type FlagHypothesisArgs = {
  hypothesisID: ID;
  onError: Function;
  onSuccess: Function;
};

export function flagHypothesis({
  hypothesisID,
  onError,
  onSuccess,
}: FlagHypothesisArgs): void {
  fetch(
    API.FLAG_GRM_CONTENT({ documentId: hypothesisID }),
    API.PATCH_CONFIG({ is_removed: false })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((_res) => onSuccess())
    .catch((error: Error) => onError(error));
}
