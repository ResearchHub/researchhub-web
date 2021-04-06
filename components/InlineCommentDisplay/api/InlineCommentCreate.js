/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
import API from "~/config/api";
import { INLINE_COMMENT_DISCUSSION_URI_SOUCE } from "./InlineCommentAPIConstants";
import { Helpers } from "@quantfive/js-web-config";
import { sendAmpEvent } from "~/config/fetch";
import { emptyFunction } from "../../PaperDraft/util/PaperDraftUtils";

export function saveCommentToBackend({
  auth,
  onSuccess,
  params,
  setMessage,
  showMessage,
}) {
  fetch(
    API.DISCUSSION({
      paperId: params.paper,
      source: INLINE_COMMENT_DISCUSSION_URI_SOUCE,
      twitter: null,
    }),
    API.POST_CONFIG(params)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      showMessage({ show: false });
      setMessage("Successfully Saved!");
      showMessage({ show: true });
      const { id: threadID, is_removed: isRemoved } = resp;
      // amp events
      let payload = {
        event_type: "create_thread",
        time: +new Date(),
        user_id: auth.user ? auth.user.id && auth.user.id : null,
        insert_id: `thread_${threadID}`,
        event_properties: {
          interaction: "Post Thread",
          paper: params.paper,
          is_removed: resp.is_removed,
        },
      };
      sendAmpEvent(payload);
      onSuccess({ threadID });
    })
    .catch((err) => {
      emptyFunction(err);
      showMessage({ show: false });
      setMessage("Something went wrong");
      showMessage({ show: true, error: true });
    });
}
