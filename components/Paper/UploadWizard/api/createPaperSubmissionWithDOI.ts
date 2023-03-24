import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

type Args = {
  onError: Function;
  onSuccess: Function;
  doi: string;
};

export function createPaperSubmissionWithDOI({
  onError,
  onSuccess,
  doi,
}: Args): void {
  fetch(API.PAPER_SUBMISSION_WITH_DOI, API.POST_CONFIG({ doi }))
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
