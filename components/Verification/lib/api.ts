import API, { generateApiUrl } from "~/config/api";
import helpers from "~/config/api/helpers";
import { captureEvent } from "~/config/utils/events";

type OpenAlexResponse = {
  count: number;
  perPage: number;
  results: any[];
};

export const fetchOpenAlexProfiles = async ({
  requestType,
  name,
  pageNumber,
}: {
  requestType: "ORCID" | "NAME";
  name?: string;
  pageNumber: number;
}): Promise<OpenAlexResponse> => {
  const url = generateApiUrl(
    `user_verification/get_openalex_author_profiles`,
    `?page=${pageNumber}`
  );

  return fetch(url, API.POST_CONFIG({ request_type: requestType, name }))
    .then(async (res) => {
      const parsed = await helpers.parseJSON(res);

      if (requestType === "ORCID") {
        return {
          count: parsed ? 1 : 0,
          perPage: 1,
          results: [parsed],
        };
      } else {
        return {
          count: parsed.meta.count,
          perPage: parsed.meta.per_page,
          results: parsed.results,
        };
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
