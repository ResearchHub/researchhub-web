import API from "../../../../config/api";
import { Helpers } from "@quantfive/js-web-config";

type Payload = {
  onError?: Function | null;
  onSuccess: Function;
};

const sciconHubID = [
  431 /* scicon2022 */, 432 /* scicon2022-present-your-research-competition */,
];

export function getSuggestedHubs({ onError, onSuccess }: Payload): void {
  const isAfterSciConDeadline =
    new Date() > new Date("07/23/2022 00:00:00 GMT-0700"); // PST

  fetch(API.HUB({ pageLimit: 1000 }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp: any): void => {
      const formattedResult: any[] = [];
      (resp?.results ?? []).forEach((hub) => {
        if (!(isAfterSciConDeadline && sciconHubID.includes(hub?.id))) {
          formattedResult.push({
            ...hub,
            value: hub.id,
            label: hub.name.charAt(0).toUpperCase() + hub.name.slice(1),
          });
        }
      });
      onSuccess(
        formattedResult.sort((a, b) => {
          return a.label.localeCompare(b.label);
        })
      );
    });
}
