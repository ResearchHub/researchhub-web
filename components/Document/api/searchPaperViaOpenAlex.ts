import { Helpers } from "@quantfive/js-web-config";
import API, { generateApiUrl } from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";

interface Props {
  doi: ID;
}

const searchPaperViaOpenAlex = ({ doi }: Props): Promise<any> => {
  const url = generateApiUrl(`paper/doi_search_via_openalex`, `?doi=${doi}`);
  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return resp;
    })
};

export default searchPaperViaOpenAlex;
