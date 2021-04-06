// api/paper/{paper_id}/discussions/?source=inline_paper_body
import API from "~/config/api";
import { INLINE_COMMENT_DISCUSSION_URI_SOUCE } from "./InlineCommentAPIConstants";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFunction } from "../../PaperDraft/util/PaperDraftUtils";

/* fetches all inline comments based on paperID */
export function inlineCommentFetchAll({
  paperId,
  onSuccess = emptyFunction,
  onError = emptyFunction,
}) {
  fetch(
    API.DISCUSSION({
      paperId,
      source: INLINE_COMMENT_DISCUSSION_URI_SOUCE,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((data) => {
      try {
        onSuccess(data.results);
      } catch (error) {
        onError(error);
      }
    })
    .catch(onError);
}

export function inlineCommentFetchTarget({
  paperId,
  targetId,
  onSuccess = emptyFunction,
  onError = emptyFunction,
}) {
  fetch(
    API.DISCUSSION({
      paperId,
      targetId,
      source: INLINE_COMMENT_DISCUSSION_URI_SOUCE,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((data) => {
      try {
        onSuccess(data);
      } catch (error) {
        onError(error);
      }
    })
    .catch(onError);
}
