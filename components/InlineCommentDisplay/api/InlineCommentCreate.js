/* - calvinhlee: this file utilizes functionalities that are legacy, I'm suppressing some warnings in this file */
import API from "~/config/api";
import { INLINE_COMMENT_DISCUSSION_URI_SOUCE } from "./InlineCommentAPIConstants";
import { Helpers } from "@quantfive/js-web-config";
import { sendAmpEvent } from "~/config/fetch";
import { emptyFunction } from "../../PaperDraft/util/PaperDraftUtils";

export function saveCommentToBackend({
  onError,
  onSuccess,
  paperID,
  params,
  threadID,
}) {
  fetch(API.THREAD_COMMENT(paperID, threadID), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      debugger;
      onSuccess({ threadID });
    })
    .catch((err) => {
      emptyFunction(err);
      setMessage("Something went wrong");
    });
}
