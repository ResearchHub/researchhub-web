import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import CitationTableRowItem, {
  CitationTableRowItemProps,
} from "./CitationTableRowItem";

type Props = { items: Array<CitationTableRowItemProps> };

/* NOTE: This table UI isn't a "table". We may want to migrate to using an actual dom table */
export default function CitationTable({ items }: Props): ReactElement<"div"> {
  const rowItems = items.map(
    (
      propPayload: CitationTableRowItemProps
    ): ReactElement<typeof CitationTableRowItem> => <CitationTableRowItem />
  );
  return (
    <div className={css(styles.citationTable)}>
      <div></div>
      {rowItems}
    </div>
  );
}

const styles = StyleSheet.create({
  citationTable: {},
});
