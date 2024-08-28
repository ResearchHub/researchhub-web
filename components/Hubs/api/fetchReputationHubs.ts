import API, { generateApiUrl, buildQueryString } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const fetchReputationHubs = async () => {
  const url = generateApiUrl(`hub/rep_hubs`);

  const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
    Helpers.parseJSON(res)
  );

  return response;  
}

export default fetchReputationHubs;