import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "~/config/api/index";
import { ID, NullableString } from "~/config/types/root_types";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  projectID: ID;
};

export const removeReferenceProject = ({
  onError,
  onSuccess,
  projectID,
}: Args): void => {
  fetch(
    buildApiUri({
      apiPath: `citation_project/${nullthrows(
        projectID,
        "projectID cannot be empty"
      )}/remove`,
    }),
    API.POST_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((payload: any): void => onSuccess(payload))
    .catch(onError);
};
