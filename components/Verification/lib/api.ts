import API, { generateApiUrl } from "~/config/api";
import helpers from "~/config/api/helpers";
import { captureEvent } from "~/config/utils/events";

export const fetchOpenAlexProfiles = async ({
  requestType,
  name,
}: {
  requestType: "ORCID" | "NAME";
  name?: string;
}): Promise<any[]> => {
  const url = generateApiUrl(`user_verification/get_openalex_author_profiles`);

  return fetch(url, API.POST_CONFIG({ request_type: requestType, name }))
    .then(async (res) => {
      const parsed = await helpers.parseJSON(res);
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        return [parsed];
      }
    })
    .catch((error) => {
      captureEvent({
        error,
        msg: "[VERIFICATION] Failed to fetch openalex profiles",
        data: { requestType },
      });
      throw error;
    });
};

export const completeProfileVerification = async ({ openAlexProfileIds }) => {
  const url = generateApiUrl(`user/verify_user`);

  return fetch(url, API.POST_CONFIG({ openalex_ids: openAlexProfileIds })).then(
    helpers.checkStatus
  );
};
