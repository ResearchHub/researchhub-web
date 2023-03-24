import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";

type Args = {
  hub_id: ID;
  onError: Function;
  onSuccess: Function;
  order_by: "asc" | "desc";
  page: number;
  start_date: string | null;
  end_date: string | null;
};

export function fetchLeadingHubs({
  hub_id,
  onError,
  onSuccess,
  order_by,
  page,
  start_date,
  end_date,
}: Args) {
  fetch(
    API.HUBS_BY_CONTRIBUTION({
      hub_id,
      order_by,
      page,
      start_date,
      end_date,
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
