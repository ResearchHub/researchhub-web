import { css, StyleSheet } from "aphrodite";
import { ID } from "../../../../config/types/root_types";
import { tableWidths } from "./constants/tableWidths";
import CitationNoResult from "./CitationNoResult";
import CitationTableRowItem, {
  CitationTableRowItemProps,
} from "./CitationTableRowItem";
import CitationTableHeaderItem from "./CitationTableHeaderItem";
import React, { ReactElement } from "react";
import colors from "../../../../config/themes/colors";

type Props = { hypothesisID: ID; items: Array<CitationTableRowItemProps> };

/* NOTE: This table UI isn't a "table". We may want to migrate to using an actual dom table */
export default function CitationTable({ items }: Props): ReactElement<"div"> {
  const rowItems =
    items.length > 0 ? (
      items.map(
        (
          propPayload: CitationTableRowItemProps
        ): ReactElement<typeof CitationTableRowItem> => (
          <CitationTableRowItem {...propPayload} />
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
        <CitationTableHeaderItem label="YEAR" width={tableWidths.YEAR} />
        <CitationTableHeaderItem
          label="Consensus"
          width={tableWidths.CONSENSUS}
        />
        <CitationTableHeaderItem label="NOTES" width={tableWidths.NOTES} />
      </div>
      <div className={css(styles.itemsWrap)}>{rowItems}</div>
    </div>
  );
}

const styles = StyleSheet.create({
  citationTable: {
    boxSizing: "border-box",
    minHeight: 120,
  },
  columnHeaderWrap: {
    border: "1px solid blue",
    borderBottom: `1px solid ${colors.LIGHT_GREY}`,
    display: "flex",
    width: "100%",
    height: 28,
  },
  itemsWrap: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "500",
    overflow: "auto",
  },
});
