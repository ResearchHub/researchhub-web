import API, { generateApiUrl } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { ID, PaginatedApiResponse } from "~/config/types/root_types";

type Args = {
  personalized?: boolean;
  pageCursor?: string | null;
  status?: string;
  hubIds?: ID[];
  bountyTypes?: string[];
};

export const fetchBounties = ({ personalized = true, pageCursor = null, hubIds = [], bountyTypes =[],  status = 'OPEN' }: Args): Promise<PaginatedApiResponse> => {

  let url = `bounty?status=${status}`;
  if (hubIds.length > 0) {
    url += `&hub_ids=${hubIds.join('&hub_ids=')}`;
  }
  if (bountyTypes.length > 0) {
    url += `&bounty_type=${bountyTypes.join('&bounty_type=')}`;
  }
  if (personalized) {
    url += '&personalized=true';
  }
  const apiUrl = pageCursor || generateApiUrl(url);

  return fetch(apiUrl, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any) => {
      return res;
    })
};

