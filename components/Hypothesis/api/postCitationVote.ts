import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";

type PostCitationVoteArgs = {
  citationID: ID;
  onError: Function;
  onSuccess: Function;
  voteType: string;
};

export function postCitationVote({
  citationID,
  onError,
  onSuccess,
  voteType,
}: PostCitationVoteArgs): void {
  fetch(API.CITATIONS_VOTE({ citationID, voteType }), API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: Object): void => {
      onSuccess(result);
    })
    .catch((error: Error): void => {
      onError(error);
    });
}
