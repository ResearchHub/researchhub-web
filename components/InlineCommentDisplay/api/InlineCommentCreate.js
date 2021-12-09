/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { sendAmpEvent } from "~/config/fetch";
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
      const ampEventPayload = {
        event_type: "create_comment",
        time: +new Date(),
        user_id: auth.user ? auth.user.id : null,
        insert_id: `comment_${comment_response.id}`,
        is_removed: comment_response.is_removed,
        event_properties: {
          interaction: "Post Comment",
          paper: paperID,
          thread: threadID,
        },
      };
      sendAmpEvent(ampEventPayload);
      onSuccess({ threadID });
    })
    .catch((err) => {
      onError(err);
      showMessage({ show: false });
      setMessage("Something went wrong");
      showMessage({ show: true, error: true });
    });
}
