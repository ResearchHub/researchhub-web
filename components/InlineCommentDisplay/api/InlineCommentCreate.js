/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";

export function saveCommentToBackend({
  auth,
  onError = emptyFncWithMsg,
  onSuccess = emptyFncWithMsg,
  paperID,
  params,
  setMessage,
  showMessage,
  threadID,
}) {
  fetch(API.THREAD_COMMENT("paper", paperID, threadID), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((comment_response) => {
      showMessage({ show: false });
      setMessage("Successfully Saved!");
      showMessage({ show: true });
      onSuccess({ threadID });
    })
    .catch((err) => {
      onError(err);
      showMessage({ show: false });
      setMessage("Something went wrong");
      showMessage({ show: true, error: true });
    });
}
