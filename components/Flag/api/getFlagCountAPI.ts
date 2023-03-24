import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { captureEvent } from "~/config/utils/events";

export default function getFlagCountAPI(): any {
  return fetch(API.FLAG_COUNT(), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((response: any) => {
      return response.count;
    })
    .catch((error: Error) => {
      captureEvent({
        error,
        msg: "Failed to fetch flag count",
      });
    });
}
