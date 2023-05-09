import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { ID, NullableString } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";

type Payload = {
  // TODO: calvinhlee - expand this as more privacy features are added
  organization: ID;
};

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  payload: Payload;
};

export const fetchReferenceProjects = ({
  onError,
  onSuccess,
  payload: { organization },
}: Args): void => {
  fetch(
    buildApiUri({
      apiPath: `citation_project/?organization=${organization}`,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((payload: any): void => onSuccess(payload))
    .catch(onError);
};
