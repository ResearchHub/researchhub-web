import API from "../../../../config/api";
import { Helpers } from "@quantfive/js-web-config";

type Payload = {
  onError?: Function | null;
  onSuccess: Function;
  searchString: string;
};

export function getSuggestedTags({ onError, onSuccess, searchString }: Payload): void {
  fetch(API.TAG({ limit: 1000, search: searchString }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp: any): void => {
      const tags = resp.tags
        .map((tag, _index) => {
          return {
            ...tag,
            value: tag.id,
            label: tag.key.charAt(0).toUpperCase() + tag.key.slice(1),
          };
        })
        .sort((a, b) => {
          return a.label.localeCompare(b.label);
        });
      onSuccess(tags);
    });
}
