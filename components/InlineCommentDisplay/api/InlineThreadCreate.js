/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
import API from "~/config/api";
import { INLINE_COMMENT_DISCUSSION_URI_SOUCE } from "./InlineCommentAPIConstants";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";

export function saveThreadToBackend({
  auth,
  onSuccess,
  params,
  setMessage,
  showMessage,
}) {
  fetch(
    API.DISCUSSION({
      documentId: params.paper,
      documentType: "paper",
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
      const { id: threadID } = resp;

      onSuccess({ threadID });
    })
    .catch((err) => {
      emptyFncWithMsg(err);
      showMessage({ show: false });
      setMessage("Something went wrong");
      showMessage({ show: true, error: true });
    });
}
