import api, { generateApiUrl } from "~/config/api";

export const updateUser = async ({ userID, params }) => {
  const url = generateApiUrl(`user/${userID}`);
  const resp = await fetch(url, api.PATCH_CONFIG(params));
  const json = await resp.json();
  return json;
};
