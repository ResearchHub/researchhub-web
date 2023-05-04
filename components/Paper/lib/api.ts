import { Helpers } from "@quantfive/js-web-config";
import * as Sentry from "@sentry/browser";
import API from "~/config/api";

type Args = {
  paperId: String
}

export const fetchPaper = ({ paperId }: Args):Promise<any> => {
  return fetch(API.PAPER({ paperId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      Sentry.captureException({ error, paperId });
      throw error;
    });
};
