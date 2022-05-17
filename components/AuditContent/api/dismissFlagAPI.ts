import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

type APIParams = {
  flagId: ID;
  verdictChoice: string,
};

type Args = {
  apiParams: APIParams;
  onSuccess: Function;
  onError: Function;  
}

export default function dismissFlag({
  apiParams,
  onSuccess,
  onError,
}: Args): void {
  fetch(
    API.DISMISS_FLAG(),
    API.POST_CONFIG({
      flag_id: apiParams.flagId,
      verdict_choice: `NOT_${apiParams.verdictChoice}`,
    })
  )
    .then(Helpers.checkStatus)
    .then((response) => onSuccess(response))
    .catch((error: Error) => {
      captureEvent({
        error,
        msg: "Failed to dismiss flag",
        data: { apiParams },
      });
      onError(error)
    });
}
