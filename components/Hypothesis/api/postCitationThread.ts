import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { ID } from "~/config/types/root_types";

type PostCitationThreadArgs = {
  onError: Function;
  onSuccess: ({ threadID }: { threadID: ID }) => void;
  params: {
    context_title: string;
    documentID: ID;
    plain_text: string;
    source: string;
    text: string;
  };
};

export function postCitationThread({
  onError,
  onSuccess,
  params,
}: PostCitationThreadArgs) {
  const { documentID, source } = params;
  // Note: calvinhlee - this is not scaleable at all we need to change this
  fetch(
    API.DISCUSSION({
      documentId: documentID,
      documentType: "citation",
      source: source,
    }),
    API.POST_CONFIG({ ...params, citation: documentID })
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp: any): void => {
      const { id: threadID, is_removed: isRemoved } = resp ?? {};
      onSuccess({ threadID });
    })
    .catch((error: Error) => onError(error));
}
