import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "~/config/api/index";
import API from "~/config/api";
import { nullthrows } from "~/config/utils/nullchecks";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response) => void;
  paperPayload: any;
};

export function postUpdatePaperAbstract({
  onError,
  onSuccess,
  paperPayload,
}: Args): void {
  fetch(
    buildApiUri({
      apiPath: `paper/${nullthrows(paperPayload?.id, "paperID not present")}`,
    }),
    API.PATCH_CONFIG(paperPayload)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any): void => onSuccess && onSuccess(response))
    .catch((error: any): void => onError && onError(error));
}
