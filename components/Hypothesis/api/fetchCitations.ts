import { CitationTableRowItemProps } from "../Citation/table/CitationTableRowItem";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import API from "~/config/api";

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
  fetch(API.CITATIONS({ hypothesisID }, "get"), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => {
      const formattedResult = result.map(
        (item: any): CitationTableRowItemProps[] | null => {
          const {
            consensus_meta,
            created_by,
            id,
            source: { document_type, documents },
            updated_date,
          } = item;
          if (document_type === "PAPER") {
            const { paper_title, title } = documents;
            const { author_profile } = created_by;
            return {
              // @ts-ignore id here is int
              citationID: id,
              consensusMeta: {
                downCount: consensus_meta?.down_count ?? 0,
                neutralCount: consensus_meta?.neutral_count ?? 0,
                upCount: consensus_meta?.up_count ?? 0,
                userVote: consensus_meta?.userVote ?? null,
              }, // need to get voting info
              citedBy: [author_profile],
              source: title || paper_title,
              type: document_type,
              year: updated_date.split("-")[0],
            };
          } else {
            // TODO: calvinhlee - work on this after search
            return null;
          }
        }
      );
      onSuccess(formattedResult);
    })
    .catch((error: Error): void => {
      onError(error);
    });
}
