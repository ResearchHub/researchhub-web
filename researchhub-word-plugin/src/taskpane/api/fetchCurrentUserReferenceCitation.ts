import { GET_CONFIG, generateApiUrl } from "../../../api/api";

type Args = {
  getCurrentUserCitation?: boolean;
  organizationID?: number;
  projectID?: number;
};

export const fetchCurrentUserReferenceCitations = async ({
  getCurrentUserCitation,
  organizationID,
  projectID,
}: Args) => {
  const apiJson = { apiPath: "citation_entry/user_citations" };
  let queryString = "?";
  // TODO: calvinhlee - clean this up
  if (organizationID) {
    queryString += `organization_id=${organizationID}&`;
  }
  if (getCurrentUserCitation) {
    queryString += `get_current_user_citations=1&`;
  }

  if (projectID) {
    queryString += `project_id=${projectID}`;
  }

  const config = GET_CONFIG({});

  const res = await fetch(generateApiUrl(apiJson.apiPath, queryString), config);
  const json = await res.json();
  return json;
};
