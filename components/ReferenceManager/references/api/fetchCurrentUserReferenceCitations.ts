import API from "~/config/api";
import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";

type Args = {
  onError: (error: Error) => void;
  onSuccess: (response: any) => void;
  organizationId: number | undefined;
};

export const fetchCurrentUserReferenceCitations = ({
  onError,
  onSuccess,
  organizationId,
}: Args): void => {
  const apiJson = { apiPath: "citation_entry/user_citations", queryString: "" };
  if (organizationId) {
    apiJson.queryString = `?organization_id=${organizationId}`;
  }

  fetch(buildApiUri(apiJson), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => onSuccess(result))
    .catch(onError);
};
