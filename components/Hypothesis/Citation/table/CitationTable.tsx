import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { fetchCitationsOnHypothesis } from "../../api/fetchCitations";
import { ID } from "~/config/types/root_types";
import { ReactElement, useEffect, useState } from "react";
import { tableMaxWidths, tableWidths } from "./constants/tableWidths";
import { ValidCitationType } from "../modal/AddNewSourceBodySearch";
import CitationNoResult from "./CitationNoResult";
import CitationTableHeaderItem from "./CitationTableHeaderItem";
import CitationTableRowItem, {
  CitationTableRowItemProps,
} from "./CitationTableRowItem";
import CitationTableRowItemPlaceholder from "./CitationTableRowItemPlaceholder";
import colors from "~/config/themes/colors";

type Props = {
  citationType: ValidCitationType;
  hypothesisID: ID;
  lastFetchTime: number | null;
  updateLastFetchTime: Function;
};

type UseEffectGetCitationsArgs = {
  citationType: ValidCitationType;
  hypothesisID: ID;
  lastFetchTime: number | null;
  setCitationItems: (items: CitationTableRowItemProps[]) => void;
  onSuccess?: Function;
};

function useEffectGetCitations({
  citationType,
  hypothesisID,
  lastFetchTime,
  setCitationItems,
  onSuccess,
}: UseEffectGetCitationsArgs): void {
  useEffect((): void => {
    fetchCitationsOnHypothesis({
      citationType,
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
  citationType,
  hypothesisID,
  lastFetchTime,
  updateLastFetchTime,
}: Props): ReactElement<"div"> {
  const [citationItems, setCitationItems] = useState<
    CitationTableRowItemProps[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffectGetCitations({
    citationType,
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
      <CitationNoResult citationType={null} />
    </div>
  );

  return (
    <div className={css(styles.citationTableWrap)}>
      <div className={css(styles.citationTable)}>
        <div className={css(styles.columnHeaderWrap)}>
          <CitationTableHeaderItem
            className={styles.sourceTitle}
            label="Paper"
            maxWidth={tableMaxWidths.SOURCE}
            width={tableWidths.SOURCE}
          />
          <CitationTableHeaderItem
            className={styles.doiTitle}
            label="DOI"
            maxWidth={tableMaxWidths.DOI}
            width={tableWidths.DOI}
          />
          <CitationTableHeaderItem
            className={styles.smallScreenControl}
            center
            label="Cited by"
            maxWidth={tableMaxWidths.CITED_BY}
            width={tableWidths.CITED_BY}
          />
          <CitationTableHeaderItem
            className={styles.smallScreenControl}
            center
            label="Comments"
            maxWidth={tableMaxWidths.COMMENTS}
            width={tableWidths.COMMENTS}
          />
          <CitationTableHeaderItem
            className={styles.smallScreenControl}
            center
            label=""
            maxWidth={tableMaxWidths.TYPE}
            width={tableWidths.TYPE}
          />
        </div>
        <div className={css(styles.itemsWrap)}>{rowItems}</div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  citationTableWrap: {
    overflowX: "auto",
  },
  citationTable: {
    boxSizing: "border-box",
    margin: "8px 0 24px",
    minHeight: 120,
    marginBottom: 0,
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
  sourceTitle: {
    paddingLeft: 8,
    [`@media only screen and (max-width:${breakpoints.xxsmall.str})`]: {
      minWidth: "unset",
      width: "35%",
    },
  },
  doiTitle: {
    paddingLeft: 8,
    [`@media only screen and (max-width:${breakpoints.xxsmall.str})`]: {
      minWidth: "unset",
      width: "35%",
    },
  },
  smallScreenControl: {
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "100px",
      minWidth: "100px",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      minWidth: "unset",
    },
  },
});
