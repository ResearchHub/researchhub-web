import { captureEvent } from "~/config/utils/events";
import { FLAG_REASON } from "../config/flag_constants";
import { Helpers } from "@quantfive/js-web-config";
import {
  CommentType,
  ID,
  KeyOf,
  RhDocumentType,
} from "~/config/types/root_types";
import API from "~/config/api";
import { RESEARCHHUB_POST_DOCUMENT_TYPES } from "~/config/utils/getUnifiedDocType";

export type FlagGrmContentArgs = {
  commentPayload?: {
    commentID?: ID;
    commentType?: CommentType;
    replyID?: ID;
    threadID?: ID;
  };
  contentID: ID;
  contentType: RhDocumentType;
  flagReason: KeyOf<typeof FLAG_REASON>;
  onError: Function;
  onSuccess: Function;
};

export function flagGrmContent({
  commentPayload = undefined,
  contentID,
  contentType,
  flagReason,
  onError,
  onSuccess,
}: FlagGrmContentArgs): void {
  const parsedContentType = RESEARCHHUB_POST_DOCUMENT_TYPES.includes(
    contentType
  )
    ? "researchhub_post"
    : contentType;
  fetch(
    API.FLAG_GRM_CONTENT({
      commentPayload,
      contentID,
      contentType: parsedContentType,
    }),
    API.POST_CONFIG({ reason_choice: flagReason })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result) => onSuccess(result))
    .catch((error: any) => {
      if (error?.response?.status !== 409) {
        captureEvent({
          error,
          msg: "Failed to flag content",
          data: { commentPayload, contentID, contentType },
        });
      }
      onError(error);
    });
}
