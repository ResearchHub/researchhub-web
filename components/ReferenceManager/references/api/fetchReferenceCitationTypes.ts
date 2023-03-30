import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
};

export const fetchReferenceCitationTypes = ({
  onError,
  onSuccess,
}: Args): void => {
  fetch(
    buildApiUri({ apiPath: `citation_entry/get_citation_types` }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => onSuccess(result))
    .catch(onError);
};
