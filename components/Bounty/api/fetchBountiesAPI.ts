import API, { generateApiUrl } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { ID, PaginatedApiResponse } from "~/config/types/root_types";
import { BOUNTY_SORT_TYPE } from "~/config/types/bounty";

type Args = {
  personalized?: boolean;
  pageCursor?: string | null;
  status?: string;
  hubIds?: ID[];
  bountyTypes?: string[];
  sort?: BOUNTY_SORT_TYPE;
  onlyParentBounties?: boolean;
};

export const fetchBounties = ({
  personalized = true,
  pageCursor = null,
  hubIds = [],
  bountyTypes =[], 
  status = 'OPEN',
  sort = "personalized",
  onlyParentBounties = true,
}: Args): Promise<PaginatedApiResponse> => {

  let query = `?status=${status}`;
  if (hubIds.length > 0) {
    query += `&hub_ids=${hubIds.join('&hub_ids=')}`;
  }
  if (bountyTypes.length > 0) {
    query += `&bounty_type=${bountyTypes.join('&bounty_type=')}`;
  }
  if (personalized) {
    query += '&personalized=true';
  }
  if (sort) {
    query += `&sort=${sort}`;
  }
  if (onlyParentBounties) {
    query += `&only_parent_bounties=true`;
  }

  const apiUrl = pageCursor || generateApiUrl("bounty") + query;

  return fetch(apiUrl, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any) => {
      return res;
    })
};

