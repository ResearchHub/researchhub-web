import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { ReactElement, ReactNode } from "react";
import { tableWidths } from "./constants/tableWidths";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import CitationConsensusItem, { ConsensusMeta } from "./CitationConsensusItem";
import colors from "~/config/themes/colors";
import Link from "next/link";
import {
  formatUnifiedDocPageUrl,
  UNIFIED_DOC_PAGE_URL_PATTERN,
} from "~/config/utils/url_patterns";

export type CitationTableRowItemProps = {
  citationID: ID;
  citedBy: Object[];
  consensusMeta: ConsensusMeta;
  source: {
    displayTitle: string;
    docType: string;
    documentID: ID;
    slug?: string | null;
  };
  type: string;
  publish_date: string;
  updateLastFetchTime: Function;
};

type ItemColumnProps = {
  bold?: boolean;
  value: ReactNode;
  width: string;
  className?: Object;
};

function ItemColumn({ bold, value, width, className }: ItemColumnProps) {
  return (
    <div
      className={css(
        styles.itemColumn,
        Boolean(bold) && styles.bold,
        className
      )}
      style={{ maxWidth: width, minWidth: width, width }}
    >
      {value}
    </div>
  );
}

export default function CitationTableRowItem({
  citationID,
  citedBy,
  consensusMeta,
  source: { displayTitle, docType, documentID, slug },
  type,
  publish_date,
  updateLastFetchTime,
}: CitationTableRowItemProps): ReactElement<"div"> {
  const citationTitleLinkUri = formatUnifiedDocPageUrl({
    docType,
    documentID,
    slug,
  });
  return (
    <div className={css(styles.tableRowItem)}>
      <ItemColumn
        bold
        value={
          <Link
            href={UNIFIED_DOC_PAGE_URL_PATTERN}
            as={citationTitleLinkUri}
            passHref
          >
            <a target="_blank" className={css(styles.link)}>{displayTitle}</a>
          </Link>
        }
        width={tableWidths.SOURCE}
      />
      <ItemColumn
        className={styles.capitalize}
        value={type && type.toLocaleLowerCase()}
        width={tableWidths.TYPE}
      />
      <ItemColumn value={publish_date} width={tableWidths.YEAR} />
      <ItemColumn
        value={
          <CitationConsensusItem
            citationID={citationID}
            consensusMeta={consensusMeta}
            updateLastFetchTime={updateLastFetchTime}
          />
        }
        width={tableWidths.CONSENSUS}
      />
      <ItemColumn
        value={<AuthorFacePile authorProfiles={citedBy} imgSize={24} />}
        width={tableWidths.CITED_BY}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  itemColumn: {
    // NOTE: this needs to match headerItem of CitationTableHeaderItem
    alignItems: "center",
    display: "flex",
    fontSize: 14,
    padding: "20px 0px",
    justifyContent: "flex-start",
    paddingRight: 16,
    fontFamily: "Roboto",
    size: 16,
    fontStyle: "normal",
    fontWeight: 400,
    boxSizing: "border-box",
  },
  bold: {
    size: 16,
    fontStyle: "normal",
    fontWeight: 500,
  },
  tableRowItem: {
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    width: "100%",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  link: {
    color: colors.BLUE(1),
    textDecoration: 'none',
  },
});
