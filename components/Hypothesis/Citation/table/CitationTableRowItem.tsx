import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import {
  formatUnifiedDocPageUrl,
  UNIFIED_DOC_PAGE_URL_PATTERN,
} from "~/config/utils/url_patterns";
import { tableWidths } from "./constants/tableWidths";
import { ReactElement, ReactNode, SyntheticEvent } from "react";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import CitationConsensusItem, { ConsensusMeta } from "./CitationConsensusItem";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import Link from "next/link";
import HypothesisUnduxStore from "../../undux/HypothesisUnduxStore";

export type CitationTableRowItemProps = {
  citationID: ID;
  citationUnidocID: ID;
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
  className?: Object | Object[];
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
  citationUnidocID,
  citedBy,
  consensusMeta,
  source: { displayTitle, docType, documentID, slug },
  type,
  updateLastFetchTime,
}: CitationTableRowItemProps): ReactElement<"div"> {
  const hypothesisUnduxStore = HypothesisUnduxStore.useStore();
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
            <a target="_blank" className={css(styles.link)}>
              {displayTitle}
            </a>
          </Link>
        }
        width={tableWidths.SOURCE}
      />
      <ItemColumn
        className={styles.capitalize}
        value={type && type.toLocaleLowerCase()}
        width={tableWidths.TYPE}
      />
      <ItemColumn
        value={
          <CitationConsensusItem
            citationID={citationID}
            consensusMeta={consensusMeta}
            shouldAllowVote
            updateLastFetchTime={updateLastFetchTime}
          />
        }
        width={tableWidths.CONSENSUS}
      />
      <ItemColumn
        className={[styles.itemCenterAlign, styles.paddingRight16]}
        value={<AuthorFacePile authorProfiles={citedBy} imgSize={24} />}
        width={tableWidths.CITED_BY}
      />
      <ItemColumn
        className={styles.itemCenterAlign}
        value={
          <div
            className={css(styles.commentsIcon)}
            onClick={(event: SyntheticEvent): void => {
              event.stopPropagation();
              hypothesisUnduxStore.set("targetCitationComment")({
                citationID,
                citationUnidocID,
                citationTitle: displayTitle,
              });
            }}
            role="button"
          >
            {icons.comments}
          </div>
        }
        width={tableWidths.COMMENTS}
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
    textDecoration: "none",
  },
  itemCenterAlign: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  commentsIcon: {
    cursor: "pointer",
    fontSize: 20,
  },
  paddingRight16: {
    paddingRight: 16,
  },
});
