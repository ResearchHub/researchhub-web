import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "../../../config/utils/nullchecks";
import { ID } from "../../../config/types/root_types";
import { nullthrows } from "../../../config/utils/nullchecks";

type Args = {
  eduEmail: string | null;
  onError?: Function;
  onSuccess?: Function;
  userID: ID;
  targetAuthorName: string;
  targetPaperId: ID;
};

type Params = {
  case_type: string;
  creator: ID;
  moderator?: ID;
  requestor: ID;
  provided_email: string;
  author?: Object;
  target_paper_id: ID;
  target_author_name: string;
};

export function createAuthorClaimCase({
  eduEmail,
  onError = emptyFncWithMsg,
  onSuccess = emptyFncWithMsg,
  userID,
  author,
  targetPaperId,
  targetAuthorName,
}: Args) {
  let params: Params = {
    case_type: "PAPER_CLAIM",
    creator: nullthrows(
      userID,
      "UserID must be present to create AuthorClaimCase"
    ),
    requestor: nullthrows(
      userID,
      "UserID must be present to create AuthorClaimCase"
    ),
    provided_email: nullthrows(
      eduEmail,
      "EduEmail must be present to create AuthorClaimCase"
    ),
    target_paper_id: targetPaperId,
    target_author_name: targetAuthorName
  };

  fetch(API.AUTHOR_CLAIM_CASE(), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any): void => {
      onSuccess();
    })
    .catch((err) => {
      const message = err.message ?? "Something went wrong!";
      if (message.includes("duplicate")) {
        onError("You already made a request to claim this author. If you believe this is a mistake, reach out via our community Slack.");
      } else if (message.includes("already claimed")) {
        onError("This author was already claimed by someone else. Your request is being reviewed.");
      } else {
        onError(message);
      }
    });
}
