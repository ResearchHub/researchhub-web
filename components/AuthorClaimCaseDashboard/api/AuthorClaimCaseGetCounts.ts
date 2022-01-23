import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "../../../config/utils/nullchecks";

export type Counts = {
  CLOSED: number;
  OPEN: number;
};

type ApiArgs = {
  onSuccess: (counts: Counts) => void;
  onError?: Function;
};

export function getCaseCounts({
  onSuccess,
  onError = emptyFncWithMsg,
}: ApiArgs): any {
  return fetch(API.AUTHOR_CLAIM_CASE_COUNT(), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any) => {
      const ret = {
        CLOSED: response.closed_count || 0,
        OPEN: response.open_count || 0,
      };
      onSuccess && onSuccess(ret);
      return ret;
    })
    .catch((e) => onError(e));
}
