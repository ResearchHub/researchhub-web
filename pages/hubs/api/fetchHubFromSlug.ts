import { captureEvent } from "~/config/utils/events";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

export default function fetchHubFromSlug({ slug }: { slug: string }): any {
  return fetch(API.HUB({ slug }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any): any => {
      console.log("res?.results", res?.results);
      return (res?.results ?? [])[0] ?? null;
    })
    .catch((error: Error): void => {
      captureEvent({
        error,
        msg: "Failed to fetchHubFromSlug",
        data: { slug },
      });
    });
}
