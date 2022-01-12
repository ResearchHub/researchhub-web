import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";

type Args = {
  hubID: ID;
  onError: Function;
  onSuccess: Function;
  page: number;
  timeframe: "all_time" | "today" | "past_week" | "past_month" | "past_year";
};

export function fetchEditors({
  hubID,
  onError,
  onSuccess,
  page = 1,
  timeframe = "all_time",
}: Args) {
  fetch(
    API.LEADERBOARD({
      hubId: hubID,
      limit: 20,
      page,
      timeframe,
      type: "user",
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
