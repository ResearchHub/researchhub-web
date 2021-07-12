import API from "../../../../config/api";
import { Helpers } from "@quantfive/js-web-config";

type Payload = {
  onError?: Function | null;
  onSuccess: Function;
};

export function getSuggestedHubs({ onError, onSuccess }: Payload): void {
  fetch(API.HUB({ pageLimit: 1000 }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp: any): void => {
      const hubs = resp.results
        .map((hub, _index) => {
          return {
            ...hub,
            value: hub.id,
            label: hub.name.charAt(0).toUpperCase() + hub.name.slice(1),
          };
        })
        .sort((a, b) => {
          return a.label.localeCompare(b.label);
        });
      onSuccess(hubs);
    });
}
