import { CitationTableRowItemProps } from "../Citation/table/CitationTableRowItem";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import { ValidCitationType } from "../Citation/modal/AddNewSourceBodySearch";
import API from "~/config/api";

type FetchCitationsOnHypothesisArgs = {
  citationType: ValidCitationType;
  hypothesisID: ID;
  onError: Function;
  onSuccess: Function;
};

export function fetchCitationsOnHypothesis({
  citationType,
  hypothesisID,
  onError,
  onSuccess,
}: FetchCitationsOnHypothesisArgs): void {
  fetch(API.CITATIONS({ hypothesisID, citationType }, "get"), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => {
      const formattedResult = result.map(
        (item: any): CitationTableRowItemProps[] | null => {
          const {
            consensus_meta,
            created_by,
            id,
            publish_date,
            source: { document_type, documents },
            citation_type,
          } = item;
          if (document_type === "PAPER") {
            const {
              id: documentID,
              paper_title,
              slug = " ",
              title,
              created_date,
              doi,
            } = documents;
            const { author_profile } = created_by;
            return {
              // @ts-ignore id here is int
              citationID: id,
              citationUnidocID: documentID,
              consensusMeta: {
                downCount: consensus_meta?.down_count ?? 0,
                neutralCount: consensus_meta?.neutral_count ?? 0,
                totalCount: consensus_meta?.total_count ?? 0,
                upCount: consensus_meta?.up_count ?? 0,
                userVote: consensus_meta?.user_vote ?? null,
              }, // need to get voting info
              citedBy: [author_profile],
              citationType: citation_type,
              source: {
                displayTitle: title || paper_title,
                docType: document_type,
                documentID: documentID ?? null,
                doi,
                slug,
              },
              publish_date: (publish_date ?? publish_date ?? "").split("-")[0],
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
