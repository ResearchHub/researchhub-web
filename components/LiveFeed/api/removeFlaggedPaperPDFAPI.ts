import { captureEvent } from "~/config/utils/events";
import { FLAG_REASON } from "~/components/Flag/config/flag_constants";
import { Helpers } from "@quantfive/js-web-config";
import { ID, KeyOf } from "~/config/types/root_types";
import API, { generateApiUrl } from "~/config/api";

type APIParams = {
  flagIds: Array<ID>;
  verdictChoice?: KeyOf<typeof FLAG_REASON>;
};

type Args = {
  apiParams: APIParams;
  onSuccess: Function;
  onError: Function;
};

export default function removeFlaggedPaperPDFApi({
  apiParams,
  onSuccess,
  onError,
}: Args): void {
  const config = {
    flag_ids: apiParams.flagIds,
    ...(apiParams.verdictChoice && { verdict_choice: apiParams.verdictChoice }),
  };

  const url = generateApiUrl("audit/remove_flagged_paper_pdf");

  fetch(url, API.POST_CONFIG(config))
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
