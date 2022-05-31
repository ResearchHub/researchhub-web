import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";
import { ID } from "~/config/types/root_types";

type Params = {
  excludeFromHomepage: Boolean;
  excludeFromHubs: Boolean;
}

type Args = {
  unifiedDocumentId: ID;
  params: Params;
  onError?: Function;
  onSuccess: Function;
}

export default function excludeFromFeed({
  unifiedDocumentId,
  params,
  onError,
  onSuccess,
}: Args) {

  return fetch(
    API.EXCLUDE_FROM_FEED({ unifiedDocumentId }),
    API.POST_CONFIG({
      exclude_from_homepage: params.excludeFromHomepage,
      exclude_from_hubs: params.excludeFromHubs,
    })
  )
    .then(Helpers.checkStatus)
    .then((response) => onSuccess(response))
    .catch((error) => {
      captureEvent({
        error,
        msg: "Failed to exclude from feed",
        data: { unifiedDocumentId, params },
      });
      onError && onError(error)
    })
}