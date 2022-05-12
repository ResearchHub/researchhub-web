import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";
import { ID } from "~/config/types/root_types";

type Args = {
  unifiedDocumentId: ID;
  onError?: Function;
  onSuccess: Function;
}

export default function excludeFromFeed({
  unifiedDocumentId,
  onError,
  onSuccess,
}: Args) {

  return fetch(
    API.INCLUDE_IN_FEED({ unifiedDocumentId }),
    API.POST_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then((response) => onSuccess(response))
    .catch((error) => {
      captureEvent({
        error,
        msg: "Failed to exclude from feed",
        data: { unifiedDocumentId },
      });
      onError && onError(error)
    })
}