import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import { INLINE_COMMENT_DISCUSSION_URI_SOUCE } from "./InlineCommentAPIConstants";
import API from "~/config/api";

/* fetches all inline comments based on paperID */
export function inlineThreadFetchAll({
  paperId,
  onSuccess = emptyFncWithMsg,
  onError = emptyFncWithMsg,
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

export function inlineThreadFetchTarget({
  paperId,
  targetId,
  onSuccess = emptyFncWithMsg,
  onError = emptyFncWithMsg,
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
    .then((res) => {
      const data = formatData(res); // res JSON changes when >= 10 comments
      try {
        onSuccess(data);
      } catch (error) {
        onError(error);
      }
    })
    .catch(onError);
}

function formatData(data) {
  if ("results" in data) {
    return data.results.pop();
  }
  return data;
}
