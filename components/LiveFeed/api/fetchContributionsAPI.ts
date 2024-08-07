import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";
import { ID, PaginatedApiResponse } from "~/config/types/root_types";

export type ApiFilters = {
  hubId?: ID | null;
  contentType?: string | null;
  authorId?: ID | null;
};

type Args = {
  pageUrl?: string | null | undefined;
  onError?: Function;
  onSuccess?: Function;
  filters?: ApiFilters;
};

export default function fetchContributionsAPI({
  pageUrl,
  onError,
  onSuccess,
  filters = {},
}: Args): Promise<PaginatedApiResponse> {
  const url = pageUrl || API.CONTRIBUTIONS({ ...filters });

  return fetch(url, API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any) => {
      onSuccess && onSuccess(response);
      return response;
    })
    .catch((error) => {
      captureEvent({
        error,
        msg: "Failed to fetch contributions",
        data: { filters, pageUrl },
      });
      onError && onError(error);
    });
}
