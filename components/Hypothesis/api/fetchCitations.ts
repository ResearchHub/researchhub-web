import { emptyFncWithMsg } from "../../../config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "../../../config/types/root_types";
import API from "../../../config/api";
import { CitationTableRowItemProps } from "../citation/table/CitationTableRowItem";

type FetchCitationsOnHypothesisArgs = {
  hypothesisID: ID;
  onError: Function;
  onSuccess: Function;
};

export function fetchCitationsOnHypothesis({
  hypothesisID,
  onError,
  onSuccess,
}: FetchCitationsOnHypothesisArgs): void {
  fetch(API.CITATIONS({ hypothesisID }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => {
      const formattedResult = result.map((item: any):
        | CitationTableRowItemProps[]
        | null => {
        const {
          id,
          created_by,
          source: { document_type, documents },
          updated_date,
        } = item;
        console.warn("ITEM: ", item);
        if (document_type === "PAPER") {
          const { paper_title, title } = documents;
          const { author_profile } = created_by;
          return {
            // @ts-ignore id here is int
            citationID: id,
            consensus: 0, // need to get voting info
            citedBy: [author_profile],
            source: title || paper_title,
            type: document_type,
            year: updated_date.split("-")[0],
          };
        } else {
          // TODO: calvinhlee - work on this after search
          return null;
        }
      });
      onSuccess(formattedResult);
    })
    .catch((error: Error): void => {
      onError(error);
    });
}
