import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";

type FetchHypothesisArgs = {
  hypothesisID: ID;
  onError: Function;
  onSuccess: Function;
};

export function fetchHypothesis({
  hypothesisID,
  onError,
  onSuccess,
}: FetchHypothesisArgs) {
  fetch(API.HYPOTHESIS({ hypothesis_id: hypothesisID }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((data) => onSuccess(data))
    .catch((error: Error): void => onError(error));
}
