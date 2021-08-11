import { css, StyleSheet } from "aphrodite";
import { ID } from "../../../../config/types/root_types";
import { tableWidths } from "./constants/tableWidths";
import CitationNoResult from "./CitationNoResult";
import CitationTableRowItem, {
  CitationTableRowItemProps,
} from "./CitationTableRowItem";
import CitationTableHeaderItem from "./CitationTableHeaderItem";
import colors from "../../../../config/themes/colors";
import React, { ReactElement, useEffect, useState } from "react";
import { fetchCitationsOnHypothesis } from "../../api/fetchCitations";
import { emptyFncWithMsg } from "../../../../config/utils/nullchecks";

type Props = {
  hypothesisID: ID;
  lastFetchTime: number;
  updateLastFetchTime: Function;
};

type UseEffectGetCitationsArgs = {
  hypothesisID: ID;
  lastFetchTime: number;
  setCitationItems: (items: CitationTableRowItemProps[]) => void;
};

function useEffectGetCitations({
  hypothesisID,
  lastFetchTime,
  setCitationItems,
}: UseEffectGetCitationsArgs): void {
  useEffect((): void => {
    fetchCitationsOnHypothesis({
      hypothesisID,
      onError: (error: Error): void => emptyFncWithMsg(error),
      onSuccess: (formattedResult: CitationTableRowItemProps[]): void =>
        setCitationItems(formattedResult),
    });
  }, [hypothesisID, lastFetchTime, setCitationItems]);
}

/* NOTE: This table UI isn't a "table". We may want to migrate to using an actual dom table */
export default function CitationTable({
  hypothesisID,
  lastFetchTime,
  updateLastFetchTime,
}: Props): ReactElement<"div"> {
  const [citationItems, setCitationItems] = useState<
    CitationTableRowItemProps[]
  >([]);

  useEffectGetCitations({ hypothesisID, lastFetchTime, setCitationItems });

  const rowItems =
    citationItems.length > 0 ? (
      citationItems.map(
        (
          propPayload: CitationTableRowItemProps,
          index: number
        ): ReactElement<typeof CitationTableRowItem> => (
          <CitationTableRowItem {...propPayload} key={index} />
        )
      )
    ) : (
      <CitationNoResult />
    );
  return (
    <div className={css(styles.citationTable)}>
      <div className={css(styles.columnHeaderWrap)}>
        <CitationTableHeaderItem label="Source" width={tableWidths.SOURCE} />
        <CitationTableHeaderItem label="Type" width={tableWidths.TYPE} />
        <CitationTableHeaderItem label="Year" width={tableWidths.YEAR} />
        <CitationTableHeaderItem
          label="Consensus"
          width={tableWidths.CONSENSUS}
        />
        <CitationTableHeaderItem
          label="Cited by"
          width={tableWidths.CITED_BY}
        />
      </div>
      <div className={css(styles.itemsWrap)}>{rowItems}</div>
    </div>
  );
}

const styles = StyleSheet.create({
  citationTable: {
    boxSizing: "border-box",
    margin: "8px 0 24px",
    minHeight: 120,
  },
  columnHeaderWrap: {
    borderBottom: `1px solid ${colors.GREY(1)}`,
    display: "flex",
    width: "100%",
    height: 58,
  },
  itemsWrap: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "500",
    overflow: "auto",
  },
});
