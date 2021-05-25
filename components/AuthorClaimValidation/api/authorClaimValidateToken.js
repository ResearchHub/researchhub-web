import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import { VALIDATION_STATE } from "../constants";
import API from "~/config/api";

export function authenticateToken({
  onError = emptyFncWithMsg,
  onSuccess = emptyFncWithMsg,
  token,
}) {
  fetch(API.AUTHOR_CLAIM_TOKEN_VALIDATION(), API.POST_CONFIG({ token }))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((_response) => {
      onSuccess();
    })
    .catch((err) => {
      onError({ err, validationState: VALIDATION_STATE.REQUEST_NOT_FOUND });
    });
}
