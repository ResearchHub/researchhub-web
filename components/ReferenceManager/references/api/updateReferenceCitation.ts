import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  payload: any;
};

export const updateReferenceCitation = ({
  onError,
  onSuccess,
  payload,
}: Args): void => {
  const formattedPayload = payload;
  fetch(
    buildApiUri({ apiPath: `citation_entry/${payload?.citation_id}` }),
    API.PUT_CONFIG(formattedPayload)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => onSuccess(result))
    .catch(onError);
};
