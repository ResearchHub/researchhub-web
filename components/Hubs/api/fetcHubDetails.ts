import API, { generateApiUrl, buildQueryString } from "~/config/api";
import { ID } from "~/config/types/root_types";
import { Helpers } from "@quantfive/js-web-config";

export const fetchHubDetailsAPI = async ({
  hubId,
}: {
  hubId: ID;
}): Promise<Comment> => {
  const url = generateApiUrl(`hub/${hubId}`);
  const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
    Helpers.parseJSON(res)
  );

  return response;
};

export default fetchHubDetailsAPI;
