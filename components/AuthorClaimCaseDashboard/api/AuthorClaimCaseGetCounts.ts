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
}: ApiArgs): void {
  fetch(API.MODERATORS_AUTHOR_CLAIM_CASE_COUNT(), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any) => {
      const formattedResult = response.map((caseData) => {
        const { target_author } = caseData;
      });
      onSuccess({
        CLOSED: response.closed_count || 0,
        OPEN: response.open_count || 0,
      });
    })
    .catch((e) => onError(e));
}
