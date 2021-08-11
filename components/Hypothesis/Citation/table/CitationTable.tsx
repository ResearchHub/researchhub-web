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

const MOCKED_ITEMS = [
  {
    citationID: "123",
    consensus: -1,
    notes: "Cursus eleifend commodore pharetra adipiscing accumsan.",
    source: "The Extraodinary Importance of Sleep",
    type: "Paper",
    year: "2021",
  },
  {
    citationID: "123",
    consensus: -1,
    notes: "Cursus eleifend commodore pharetra adipiscing accumsan.",
    source: "The Extraodinary Importance of Sleep",
    type: "Paper",
    year: "2021",
  },
];

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
      onSuccess: (response: any): void => {
        console.warn("RESPONSE: ", response);
        // setCitationItems({})
      },
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

  const mockedItems = [...citationItems, ...MOCKED_ITEMS];
  const rowItems =
    mockedItems.length > 0 ? (
      mockedItems.map(
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
        <CitationTableHeaderItem label="Notes" width={tableWidths.NOTES} />
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
