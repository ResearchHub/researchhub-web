import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";

type Args = {
  getCurrentUserCitation?: boolean;
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  organizationID: ID;
  projectID: ID;
  organizationSlug?: string;
  projectSlug: string;
};

export const fetchCurrentUserReferenceCitations = ({
  getCurrentUserCitation,
  onError,
  onSuccess,
  organizationID,
  organizationSlug,
  projectSlug,
  projectID,
}: Args): Promise<any> => {
  const apiJson = {
    apiPath: "citation_entry/user_citations",
    queryString: "?",
  };
  // TODO: calvinhlee - clean this up
  if (organizationSlug) {
    apiJson.queryString += `organization__slug=${organizationSlug}&`;
  } else if (organizationID) {
    apiJson.queryString += `organization_id=${organizationID}&`;
  }

  if (getCurrentUserCitation) {
    apiJson.queryString += `get_current_user_citations=1&`;
  }
  if (projectSlug) {
    apiJson.queryString += `project_slug=${projectSlug}&`;
  } else if (projectID) {
    apiJson.queryString += `project_id=${projectID}&`;
  }

  return fetch(buildApiUri(apiJson), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => {
      onSuccess(result);
    })
    .catch(onError);
};
