import { emptyFncWithMsg } from "../../../config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "../../../config/types/root_types";
import API from "../../../config/api";

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
      const formattedResult = result.map((item: any) => {
        const {
          id,
          source: { document_type, documents },
          notes = "",
          updated_date,
        } = item;
        if (document_type === "PAPER") {
          const { paper_title, title } = documents;
          return {
            citationID: id,
            consensus: 0, // need to get voting info
            notes,
            source: title || paper_title,
            type: document_type,
            year: updated_date.split("-")[0],
          };
        } else {
          // TODO: calvinhlee - work on this after search
          return {};
        }
      });
      console.warn("formattedResult: ", formattedResult);
      onSuccess(formattedResult);
    })
    .catch((error: Error): void => {
      onError(error);
    });
}
function formattedResult(formattedResult: any) {
  throw new Error("Function not implemented.");
}
