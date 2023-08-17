import Helpers from "~/config/api/helpers";
import { captureEvent } from "~/config/utils/events";
import API, { generateApiUrl } from "~/config/api";

export const fetchCitation = ({ citationId }): Promise<any> => {
  const url = generateApiUrl(`citation_entry/${citationId}`);

  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      console.error("Failed to fetch citation. Error", error);
    });
};
