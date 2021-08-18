import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { tableWidths } from "./constants/tableWidths";
import CitationNoResult from "./CitationNoResult";
import CitationTableRowItem, {
  CitationTableRowItemProps,
} from "./CitationTableRowItem";
import CitationTableHeaderItem from "./CitationTableHeaderItem";
import colors from "~/config/themes/colors";
import React, { ReactElement, useEffect, useState } from "react";
import { fetchCitationsOnHypothesis } from "../../api/fetchCitations";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
} from "~/config/utils/nullchecks";
import CitationTableRowItemPlaceholder from "./CitationTableRowItemPlaceholder";
import CitationAddNewButton from "../CitationAddNewButton";

type Props = {
  hypothesisID: ID;
  lastFetchTime: number | null;
  updateLastFetchTime: Function;
};

type UseEffectGetCitationsArgs = {
  hypothesisID: ID;
  lastFetchTime: number | null;
  setCitationItems: (items: CitationTableRowItemProps[]) => void;
  updateLastFetchTime: Function;
  onSuccess?: Function;
};

function useEffectGetCitations({
  hypothesisID,
  lastFetchTime,
  setCitationItems,
  onSuccess,
  updateLastFetchTime,
}: UseEffectGetCitationsArgs): void {
  useEffect((): void => {
    console.log(lastFetchTime);
    // if (isNullOrUndefined(lastFetchTime)) {
    fetchCitationsOnHypothesis({
      hypothesisID,
      onError: (error: Error): void => emptyFncWithMsg(error),
      onSuccess: (formattedResult: CitationTableRowItemProps[]): void => {
        setCitationItems(formattedResult);
        onSuccess && onSuccess();
        // updateLastFetchTime();
      },
    });
    // }
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

  const [isLoading, setIsLoading] = useState(true);
  useEffectGetCitations({
    hypothesisID,
    lastFetchTime,
    setCitationItems,
    updateLastFetchTime,
    onSuccess: () => setIsLoading(false),
  });
  const rowItems = isLoading ? (
    [
      <CitationTableRowItemPlaceholder />,
      <CitationTableRowItemPlaceholder />,
      <CitationTableRowItemPlaceholder />,
    ]
  ) : citationItems.length > 0 ? (
    citationItems.map(
      (
        propPayload: CitationTableRowItemProps,
        index: number
      ): ReactElement<typeof CitationTableRowItem> => (
        <CitationTableRowItem {...propPayload} key={index} />
      )
    )
  ) : (
    <div className={css(styles.citationNoResults)}>
      <CitationNoResult />
      <CitationAddNewButton
        hypothesisID={hypothesisID}
        lastFetchTime={lastFetchTime}
        updateLastFetchTime={updateLastFetchTime}
      />
    </div>
  );

  return (
    <div className={css(styles.citationTable)}>
      <div className={css(styles.columnHeaderWrap)}>
        <CitationTableHeaderItem label="Paper" width={tableWidths.SOURCE} />
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
      {citationItems.length > 0 ? (
        <div className={css(styles.addCitation)}>
          <CitationAddNewButton
            hypothesisID={hypothesisID}
            lastFetchTime={lastFetchTime}
            updateLastFetchTime={updateLastFetchTime}
          />
        </div>
      ) : null}
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
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    width: "100%",
    height: 52,
  },
  itemsWrap: {
    display: "flex",
    flexDirection: "column",
    // maxHeight: "500",
    // overflow: "auto",
  },
  citationNoResults: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  addCitation: {
    marginTop: 20,
  },
});
