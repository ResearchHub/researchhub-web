import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  payload: FormData;
};

export const createReferenceCitation = ({
  onError,
  onSuccess,
  payload,
}: Args): void => {
  fetch(
    buildApiUri({ apiPath: `citation_entry` }),
    API.POST_FILE_CONFIG(payload)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => onSuccess(result))
    .catch(onError);
};
