import { Helpers } from "@quantfive/js-web-config";
import { FLAG_REASON } from "~/components/Flag/config/constants";
import API from "~/config/api";
import { ID, KeyOf } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

type APIParams = {
  flagId: ID;
  verdictChoice: KeyOf<typeof FLAG_REASON>,
};

type Args = {
  apiParams: APIParams;
  onSuccess: Function;
  onError: Function;  
}

export default function removeFlaggedContent({
  apiParams,
  onSuccess,
  onError,
}: Args): void {
  fetch(
    API.REMOVE_FLAGGED_CONTENT(),
    API.POST_CONFIG({
      flag_id: apiParams.flagId,
      verdict_choice: apiParams.verdictChoice,
    })
  )
    .then(Helpers.checkStatus)
    .then((response) => onSuccess(response))
    .catch((error: Error) => {
      captureEvent({
        error,
        msg: "Failed to remove flagged content",
        data: { apiParams },
      });
      onError(error)
    });
}
