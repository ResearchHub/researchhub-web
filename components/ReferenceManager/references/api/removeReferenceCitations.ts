import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  payload: { citation_entry_ids: ID[] };
};

export const removeReferenceCitations = ({
  onError,
  onSuccess,
  payload,
}: Args): void => {
  fetch(
    buildApiUri({ apiPath: `citation_entry/remove` }),
    API.POST_CONFIG(payload)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => onSuccess(result))
    .catch(onError);
};
