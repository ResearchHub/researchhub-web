import { FLAG_REASON } from "../config/constants";
import { Helpers } from "@quantfive/js-web-config";
import { ID, KeyOf } from "~/config/types/root_types";
import API from "~/config/api";

type ContentType = "hypothesis" | "paper" | "post";

type CommentType = "comment" | "reply" | "thread";

type FlagGrmContentArgs = {
  commentID?: ID;
  commentType?: CommentType;
  contentID: ID;
  contentType: ContentType;
  flagReason: KeyOf<typeof FLAG_REASON>;
  onError: Function;
  onSuccess: Function;
};

export function flagGrmContent({
  commentID,
  commentType,
  contentID,
  contentType,
  flagReason,
  onError,
  onSuccess,
}: FlagGrmContentArgs): void {
  fetch(
    API.FLAG_GRM_CONTENT({
      commentID,
      commentType,
      contentID,
      contentType,
    }),
    API.POST_CONFIG({ reason_choice: flagReason })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result) => onSuccess(result))
    .catch((error: Error) => onError(error));
}
