import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import colors from "../../../../config/themes/colors";
import { ID } from "../../../../config/types/root_types";
import { tableWidths } from "./constants/tableWidths";

export type CitationTableRowItemProps = {
  citationID: ID;
  consensus: number;
  notes: string;
  source: string;
  type: string;
  year: string;
};

type ItemColumnProps = {
  value: number | string;
  width: string;
};

function ItemColumn({ value, width }) {
  return (
    <div
      className={css(styles.itemColumn)}
      style={{ maxWidth: width, minWidth: width, width }}
    >
      {value}
    </div>
  );
}

export default function CitationTableRowItem({
  consensus,
  notes,
  source,
  type,
  year,
}: CitationTableRowItemProps): ReactElement<"div"> {
  return (
    <div className={css(styles.tableRowItem)}>
      <ItemColumn value={source} width={tableWidths.SOURCE} />
      <ItemColumn value={type} width={tableWidths.TYPE} />
      <ItemColumn value={year} width={tableWidths.YEAR} />
      <ItemColumn value={consensus} width={tableWidths.CONSENSUS} />
      <ItemColumn value={notes} width={tableWidths.NOTES} />
    </div>
  );
}

const styles = StyleSheet.create({
  itemColumn: {
    // NOTE: this needs to match headerItem of CitationTableHeaderItem
    alignItems: "center",
    display: "flex",
    fontSize: 14,
    height: 56,
    justifyContent: "flex-start",
    padding: "0 8px",
  },
  tableRowItem: {
    borderBottom: `1px solid ${colors.GREY(1)}`,
    display: "flex",
    width: "100%",
  },
});
