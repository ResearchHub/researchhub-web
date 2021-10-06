import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { fetchCitationsOnHypothesis } from "../../api/fetchCitations";
import { ID } from "~/config/types/root_types";
import { ReactElement, useEffect, useState } from "react";
import { tableWidths } from "./constants/tableWidths";
import CitationNoResult from "./CitationNoResult";
import CitationAddNewButton from "../CitationAddNewButton";
import CitationTableHeaderItem from "./CitationTableHeaderItem";
import CitationTableRowItem, {
  CitationTableRowItemProps,
} from "./CitationTableRowItem";
import CitationTableRowItemPlaceholder from "./CitationTableRowItemPlaceholder";
import colors from "~/config/themes/colors";

type Props = {
  hypothesisID: ID;
  lastFetchTime: number | null;
  updateLastFetchTime: Function;
};

type UseEffectGetCitationsArgs = {
  hypothesisID: ID;
  lastFetchTime: number | null;
  setCitationItems: (items: CitationTableRowItemProps[]) => void;
  onSuccess?: Function;
};

function useEffectGetCitations({
  hypothesisID,
  lastFetchTime,
  setCitationItems,
  onSuccess,
}: UseEffectGetCitationsArgs): void {
  useEffect((): void => {
    fetchCitationsOnHypothesis({
      hypothesisID,
      onError: (error: Error): void => emptyFncWithMsg(error),
      onSuccess: (formattedResult: CitationTableRowItemProps[]): void => {
        setCitationItems(formattedResult);
        onSuccess && onSuccess();
      },
    });
  }, [hypothesisID, lastFetchTime, setCitationItems]);
}

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
    onSuccess: () => setIsLoading(false),
  });

  const rowItems = isLoading ? (
    [
      <CitationTableRowItemPlaceholder key="citation-table-item-1" />,
      <CitationTableRowItemPlaceholder key="citation-table-item-2" />,
      <CitationTableRowItemPlaceholder key="citation-table-item-3" />,
    ]
  ) : citationItems.length > 0 ? (
    citationItems.map(
      (
        propPayload: CitationTableRowItemProps,
        index: number
      ): ReactElement<typeof CitationTableRowItem> => (
        <CitationTableRowItem
          {...propPayload}
          key={index}
          updateLastFetchTime={updateLastFetchTime}
        />
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
    <>
      <div className={css(styles.citationTable)}>
        <div className={css(styles.columnHeaderWrap)}>
          <CitationTableHeaderItem label="Paper" width={tableWidths.SOURCE} />
          <CitationTableHeaderItem label="Type" width={tableWidths.TYPE} />
          <CitationTableHeaderItem
            label="Consensus"
            width={tableWidths.CONSENSUS}
          />
          <CitationTableHeaderItem
            label="Cited by"
            width={tableWidths.CITED_BY}
          />
          <CitationTableHeaderItem
            label="Comments"
            width={tableWidths.COMMENTS}
          />
        </div>
        <div className={css(styles.itemsWrap)}>{rowItems}</div>
      </div>
      {citationItems.length > 0 ? (
        <div className={css(styles.addCitation)}>
          <CitationAddNewButton
            hypothesisID={hypothesisID}
            lastFetchTime={lastFetchTime}
            updateLastFetchTime={updateLastFetchTime}
          />
        </div>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  citationTable: {
    boxSizing: "border-box",
    margin: "8px 0 24px",
    minHeight: 120,
    overflow: "auto",
    marginBottom: 0,
  },
  columnHeaderWrap: {
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    width: "100%",
    height: 52,
    minWidth: 820,
  },
  itemsWrap: {
    display: "flex",
    flexDirection: "column",
    minWidth: 820,
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
