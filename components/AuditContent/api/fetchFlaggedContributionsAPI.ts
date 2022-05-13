import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";

type Filters = {
  hubId?: number; 
}

type Args = {
  pageUrl: string|null;
  onError?: Function;
  onSuccess: Function;
  filters: Filters;
}

export default function fetchAuditContributions({
  pageUrl,
  onError,
  onSuccess,
  filters,
}: Args) {

  const url = pageUrl ||  API.FLAGS({ ...filters })

  return fetch(
    url,
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response) => onSuccess(response))
    .catch((error) => {
      captureEvent({
        error,
        msg: "Failed to fetch contributions",
        data: { filters, pageUrl },
      });
      onError && onError(error)
    })
}