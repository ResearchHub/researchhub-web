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

export const fetchAuthorSummary = async ({
  authorId,
}: {
  authorId: string;
}) => {
  const url = generateApiUrl(`author/${authorId}/summary_stats`);

  const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
    Helpers.parseJSON(res)
  );

  return response;
};

export const fetchAuthorAchievements = async ({
  authorId,
}: {
  authorId: string;
}) => {
  const url = generateApiUrl(`author/${authorId}/achievements`);

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
  nextUrl = null,
}: {
  authorId: ID;
  nextUrl?: string | null;
}): any => {
  const url = nextUrl || generateApiUrl(`author/${authorId}/publications`);

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

export const fetchProfileData = async ({
  authorId,
  fetchOverview = false,
  fetchAchievements = false,
  fetchSummary = false,
}: {
  authorId: string,
  fetchOverview?: boolean,
  fetchAchievements?: boolean,
  fetchSummary?: boolean,
}) => {
  const promises:Array<Promise<any>> = [];
  
  const profilePromise = fetchAuthorProfile({ authorId });
  promises.push(profilePromise);

  if (fetchOverview) {
    const overviewPromise = fetchAuthorOverview({ authorId });
    promises.push(overviewPromise);
  }

  if (fetchSummary) {
    const summaryPromise = fetchAuthorSummary({ authorId });
    promises.push(summaryPromise);
  }

  if (fetchAchievements) {
    const achievementPromise = fetchAuthorAchievements({ authorId });
    promises.push(achievementPromise);
  }

  return Promise.all(promises);
}

export const createAuthor = async ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  const url = generateApiUrl('author');
  
  const response = await fetch(url, {
    ...API.POST_CONFIG({
      first_name: firstName,
      last_name: lastName,
    }),
  }).then(Helpers.parseJSON);

  return response;
};