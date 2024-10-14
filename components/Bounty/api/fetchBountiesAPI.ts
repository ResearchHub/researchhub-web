import API, { generateApiUrl } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { ID, PaginatedApiResponse } from "~/config/types/root_types";

type Args = {
  personalized?: boolean;
  pageCursor?: string | null;
  status?: string;
  hubIds?: ID[];
};

export const fetchBounties = ({ personalized = true, pageCursor = null, hubIds = [], status = 'OPEN' }: Args): Promise<PaginatedApiResponse> => {

  let url = `bounty?status=${status}`;
  if (hubIds.length > 0) {
    url += `&hub_ids=${hubIds.join(',')}`;
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

