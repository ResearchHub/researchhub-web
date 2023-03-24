import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

type Args = {
  onError: Function;
  onSuccess: Function;
  url: string;
};

export async function createPaperSubmissionWithURL({
  onError,
  onSuccess,
  url,
}: Args) {
  fetch(API.PAPER_SUBMISSION, API.POST_CONFIG({ url }))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => {
      if (result?.paper_status === "INITIATED") {
        onSuccess(result);
      }
    })
    .catch((error: Error) => {
      onError(error);
    });
}
