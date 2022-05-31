import { captureEvent } from "~/config/utils/events";
import { FLAG_REASON } from "~/components/Flag/config/flag_constants";
import { Helpers } from "@quantfive/js-web-config";
import { ID, KeyOf } from "~/config/types/root_types";
import API from "~/config/api";

type APIParams = {
  flagIds: Array<ID>;
  verdictChoice?: KeyOf<typeof FLAG_REASON>;
};

type Args = {
  apiParams: APIParams;
  onSuccess: Function;
  onError: Function;
};

export default function removeFlaggedContent({
  apiParams,
  onSuccess,
  onError,
}: Args): void {
  const config = {
    flag_ids: apiParams.flagIds,
    ...(apiParams.verdictChoice && { verdict_choice: apiParams.verdictChoice }),
  };

  fetch(API.REMOVE_FLAGGED_CONTENT(), API.POST_CONFIG(config))
    .then(Helpers.checkStatus)
    .then((response) => onSuccess(response))
    .catch((error: Error) => {
      captureEvent({
        error,
        msg: "Failed to remove flagged content",
        data: { apiParams },
      });
      onError(error);
    });
}
