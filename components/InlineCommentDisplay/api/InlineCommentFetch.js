// api/paper/{paper_id}/discussions/?source=inline_paper_body
import API from "~/config/api";
import { DISCUSSION_URI_SOUCE } from "./InlineCommentAPIConstants";
import { Helpers } from "@quantfive/js-web-config";

/* fetches all inline comments based on paperID */
export function inlineCommentFetch({ paperId, onSuccess, onError }) {
  fetch(
    API.DISCUSSION({
      paperId,
      source: DISCUSSION_URI_SOUCE,
      // isRemoved: true,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((data) => {
      console.warn("yoyoyo: ", data);
    })
    .catch(onError);
}
