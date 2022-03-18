import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import API from "~/config/api";

type Props = {
  onError: Function;
  onSuccess: Function;
  url: string;
};

export function createPaperSubmissioncreatePaperSubmissionWithURL({
  onError,
  onSuccess,
  url,
}: Props): void {
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
