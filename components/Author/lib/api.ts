import API, { generateApiUrl, buildQueryString } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";

export type PaginatedPublicationResponse = {
  results: any[];
  total: number;
  next: string;
  previous: string;
};

export const fetchAuthorProfile = async ({
  authorId,
}: {
  authorId: string;
}) => {
  const url = generateApiUrl(`author/${authorId}/profile`);

  const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
    Helpers.parseJSON(res)
  );

  return response;
};

export const fetchAuthorOverview = async ({
  authorId,
}: {
  authorId: string;
}) => {
  const url = generateApiUrl(`author/${authorId}/overview`);

  const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
    Helpers.parseJSON(res)
  );

  return response;
};

export const parsePublicationResponse = (
  raw: any
): PaginatedPublicationResponse => {
  return {
    results: raw.results,
    total: raw.total,
    next: raw.next,
    previous: raw.previous,
  };
};

export const fetchAuthorPublications = ({
  authorId,
}: {
  authorId: ID;
}): any => {
  const url = generateApiUrl(`author/${authorId}/publications`);

  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const removePublicationFromAuthorProfile = ({
  authorId,
  paperIds,
}: {
  authorId: ID;
  paperIds: ID[];
}) => {
  const url = generateApiUrl(`author/${authorId}/publications`);

  return fetch(
    url,
    API.DELETE_CONFIG_WITH_BODY({
      paper_ids: paperIds,
    })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};
