import API, { generateApiUrl, buildQueryString } from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";

export const fetchUserDetails = async ({
  userId,
}: {
  userId: ID;
}) => {
  const url = generateApiUrl(`moderator/${userId}/user_details`);

  const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
    Helpers.parseJSON(res)
  );

  return response;
};
