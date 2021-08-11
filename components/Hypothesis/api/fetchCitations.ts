import { emptyFncWithMsg } from "../../../config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "../../../config/types/root_types";
import API from "../../../config/api";

type FetchCitationsOnHypothesisArgs = {
  hypothesisID: ID;
  onError: Function;
  onSuccess: Function;
};

export function fetchCitationsOnHypothesis({
  hypothesisID,
  onError,
  onSuccess,
}: FetchCitationsOnHypothesisArgs): void {
  fetch(API.CITATIONS({ hypothesisID }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp): void => {
      onSuccess(resp);
    })
    .catch((error: Error): void => {
      onError(error);
    });
}
