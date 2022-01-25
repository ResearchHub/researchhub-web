import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";

type Args = {
  hub_id: ID;
  onError: Function;
  onSuccess: Function;
  order_by: "asc" | "desc";
  page: number;
  timeframe_str: string | null;
};

export function fetchEditors({
  hub_id,
  onError,
  onSuccess,
  order_by,
  page,
  timeframe_str,
}: Args) {
  fetch(
    API.RESEARCHHUB_EDITORS_BY_CONTRIBUTION({
      hub_id,
      order_by,
      page,
      timeframe_str,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      onSuccess(res);
    })
    .catch((error: Error) => onError(error));
}
