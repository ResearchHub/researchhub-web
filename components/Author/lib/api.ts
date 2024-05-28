import API, { generateApiUrl, buildQueryString } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

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
