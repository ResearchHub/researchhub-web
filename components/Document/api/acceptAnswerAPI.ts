import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

type Args = {
  documentId: ID;
  documentType: string;
  threadId: ID;
  onSuccess: Function;
  onError: Function;
  commentId?: ID;
};

export default function acceptAnswerAPI({
  documentId,
  documentType,
  threadId,
  onSuccess,
  onError,
  commentId,
}: Args): void {
  const url =
    API.buildPaperChainUrl(
      documentType,
      null,
      documentId,
      threadId,
      commentId
    ) + "mark_as_accepted_answer/";
  fetch(url, API.POST_CONFIG({}))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((_res) => onSuccess())
    .catch((error: Error) => {
      captureEvent({
        error,
        msg: "Failed mark answer as accepted",
        data: {
          documentId,
          documentType,
          threadId,
        },
      });
      onError(error);
    });
}
