import { CitationTableRowItemProps } from "../Citation/table/CitationTableRowItem";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";

type FetchCitationsThreadsArgs = {
  citationID: ID;
  onError: Function;
  onSuccess: Function;
};

export function fetchCitationsThreads({
  citationID,
  onError,
  onSuccess,
}: FetchCitationsThreadsArgs): void {
  fetch(
    API.DISCUSSION({
      documentId: citationID,
      documentType: "citation",
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((payload: any): void => onSuccess(payload?.results ?? []))
    .catch((error: Error): void => {
      onError(error);
    });
}
