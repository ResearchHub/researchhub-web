import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";

type Args = {
  hubID: ID;
  onError: Function;
  onSuccess: Function;
  timeframe_str: string | null;
};

export function fetchEditors({ hubID, onError, onSuccess, timeframe_str }: Args) {
  fetch(
    API.RESEARCHHUB_EDITORS_BY_CONTRIBUTION({
      hub_id: hubID,
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
