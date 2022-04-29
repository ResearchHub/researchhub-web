import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID, NullableString } from "~/config/types/root_types";
import Title from "~/pages/post/[documentId]/[title]";

type Args = {
  currentUserID: ID;
  doi: string;
  hubs: ID[];
  onError: Function;
  onSuccess: Function;
  submissionID: ID;
  title: NullableString;
};

export function createAsyncPaperUpdator({
  currentUserID,
  doi,
  hubs,
  onError,
  onSuccess,
  submissionID,
  title,
}: Args): void {
  fetch(
    API.ASYNC_PAPER_UPDATOR,
    API.POST_CONFIG({
      paper_submission: submissionID,
      title,
      hubs,
      doi,
      created_by: currentUserID,
    })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => {
      onSuccess(result);
    })
    .catch((error: Error) => {
      onError(error);
    });
}
