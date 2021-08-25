import { Helpers } from "@quantfive/js-web-config";
import { ID } from "../../../config/types/root_types";
import API from "../../../config/api";

type PostHypothesisVoteArgs = {
  hypothesisID: ID;
  onError: Function;
  onSuccess: Function;
  voteType: string;
};

export function postHypothesisVote({
  hypothesisID,
  onError,
  onSuccess,
  voteType,
}: PostHypothesisVoteArgs): void {
  fetch(API.HYPOTHESIS_VOTE({ hypothesisID, voteType }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: Object): void => {
      onSuccess(result);
    })
    .catch((error: Error): void => {
      onError(error);
    });
}
