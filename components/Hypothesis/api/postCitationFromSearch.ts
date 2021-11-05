import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import { ValidCitationType } from "../Citation/modal/AddNewSourceBodySearch";
import API from "~/config/api";

type PostCitationFromSearchArgs = {
  onError: Function;
  onSuccess: Function;
  payload: {
    hypothesis_id: ID;
    source_id: ID;
    type: ValidCitationType;
  };
};

export function postCitationFromSearch({
  onError,
  onSuccess,
  payload,
}: PostCitationFromSearchArgs): void {
  fetch(API.CITATIONS({}, "post"), API.POST_CONFIG(payload))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: Object): void => onSuccess(result))
    .catch((error: Error): void => onError(error));
}
