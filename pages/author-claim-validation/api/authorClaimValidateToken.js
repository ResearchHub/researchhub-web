import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

export function authenticateToken({
  onError = emptyFncWithMsg,
  onSuccess = emptyFncWithMsg,
  token,
}) {
  fetch(API.AUTHOR_CLAIM_TOKEN_VALIDATION(), API.POST_CONFIG({ token }))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response) => {
      console.warn("response: ", response);
      onSuccess();
    })
    .catch((err) => {
      console.warn("err: ", err);
      onError(err);
    });
}
