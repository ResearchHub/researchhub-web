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
  targetAuthorID: ID;
  author?: Object;
};

type Params = {
  case_type: string;
  creator: ID;
  moderator?: ID;
  requestor: ID;
  provided_email: string;
  target_author: ID;
  author?: Object;
};

export function createAuthorClaimCase({
  eduEmail,
  onError = emptyFncWithMsg,
  onSuccess = emptyFncWithMsg,
  targetAuthorID,
  userID,
  author,
}: Args) {
  let params: Params = {
    case_type: "AUTHOR_CLAIM",
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
    target_author: targetAuthorID,
  };

  if (author) {
    params.author = author;
  }

  fetch(API.AUTHOR_CLAIM_CASE(), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any): void => {
      onSuccess();
    })
    .catch((err) => {
      const message = err.message ?? "Something went wrong!";
      if (message.includes("duplicate")) {
        onError("You already made a request to claim this author.");
      } else if (message.includes("already claimed")) {
        onError("This author was already claimed by someone else.");
      } else {
        onError(message);
      }
    });
}
