import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  organizationID: ID;
  projectID: ID;
};

export const fetchCurrentUserReferenceCitations = ({
  onError,
  onSuccess,
  organizationID,
  projectID,
}: Args): void => {
  const apiJson = { apiPath: "citation_entry/user_citations", queryString: "" };
  // TODO: calvinhlee - clean this up
  if (organizationID) {
    apiJson.queryString = `?organization_id=${organizationID}`;
  }
  if (projectID) {
    apiJson.queryString = `?organization_id=${organizationID}&project_id=${projectID}`;
  }

  fetch(buildApiUri(apiJson), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => onSuccess(result))
    .catch(onError);
};
