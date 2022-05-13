import { FLAG_REASON } from "../config/constants";
import { Helpers } from "@quantfive/js-web-config";
import { ID, KeyOf } from "~/config/types/root_types";
import API from "~/config/api";

type ContentType =
  | "comment"
  | "hypothesis"
  | "paper"
  | "post"
  | "reply"
  | "thread";

type FlagGrmContentArgs = {
  contentID: ID;
  contentType: ContentType;
  flagReason: KeyOf<typeof FLAG_REASON>;
  onError: Function;
  onSuccess: Function;
};

export function flagGrmContent({
  contentID,
  contentType,
  flagReason,
  onError,
  onSuccess,
}: FlagGrmContentArgs): void {
  fetch(
    API.FLAG_GRM_CONTENT({ ID: contentID, contentType }),
    API.POST_CONFIG({ reason_choice: flagReason })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result) => onSuccess(result))
    .catch((error: Error) => onError(error));
}
