import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import {
  formatUnifiedDocPageUrl,
  UNIFIED_DOC_PAGE_URL_PATTERN,
} from "~/config/utils/url_patterns";
import { breakpoints } from "~/config/themes/screen";
import { ConsensusMeta } from "./CitationConsensusItem";
import { ReactElement, ReactNode, SyntheticEvent } from "react";
import { tableMaxWidths, tableWidths } from "./constants/tableWidths";
import { ValidCitationType } from "../modal/AddNewSourceBodySearch";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import CitationVoteItem from "./CitationVoteItem";
import colors from "~/config/themes/colors";
import HypothesisUnduxStore from "../../undux/HypothesisUnduxStore";
import icons from "~/config/themes/icons";
import Link from "next/link";

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
  type: ValidCitationType;
  publish_date: string;
  updateLastFetchTime: Function;
};

type ItemColumnProps = {
  bold?: boolean;
  className?: Object | Object[];
  maxWidth?: string;
  value: ReactNode;
  width: string;
};

function ItemColumn({
  bold,
  className,
  maxWidth,
  value,
  width,
}: ItemColumnProps) {
  return (
    <div
      className={css(
        styles.itemColumn,
        Boolean(bold) && styles.bold,
        className
      )}
      style={{ maxWidth: maxWidth ?? width, width }}
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
  const isSupportSource = type === "SUPPORT";

  return (
    <div className={css(styles.tableRowItem)}>
      <ItemColumn
        className={styles.itemCenterAlign}
        value={
          <CitationVoteItem
            citationID={citationID}
            updateLastFetchTime={updateLastFetchTime}
            voteMeta={{ ...consensusMeta }}
          />
        }
        width={tableWidths.CONSENSUS}
      />
      <ItemColumn
        className={styles.padding8}
        maxWidth={tableMaxWidths.SOURCE}
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
        maxWidth={tableMaxWidths.TYPE}
        className={[styles.capitalize, styles.itemCenterAlign]}
        value={
          <div
            className={css(
              styles.typeIcon,
              isSupportSource ? styles.green : styles.red
            )}
            role="none"
          >
            <div className={css(styles.iconWrap)}>
              {isSupportSource ? icons.checkCircle : icons.timesCircle}
            </div>
            <div className={css(styles.typeText)}>
              {isSupportSource ? "Support" : "Reject"}
            </div>
          </div>
        }
        width={tableWidths.TYPE}
      />
      <ItemColumn
        maxWidth={tableMaxWidths.CITED_BY}
        className={[styles.itemCenterAlign]}
        value={<AuthorFacePile authorProfiles={citedBy} imgSize={24} />}
        width={tableWidths.CITED_BY}
      />
      <ItemColumn
        maxWidth={tableMaxWidths.COMMENTS}
        className={[styles.itemCenterAlign, styles.maxWidthSmall]}
        value={
          <div
            className={css(styles.commentsIcon, styles.paddingBottom4)}
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
  typeText: {
    display: "block",
    fontSize: 12,
  },
  typeIcon: {
    alignItems: "center",
    color: colors.LIGHT_GREY_TEXT,
    display: "flex",
    flexDirection: "column",
    width: 36,
  },
  green: {
    color: colors.GREEN(1),
  },
  red: {
    color: colors.RED(1),
  },
  iconWrap: {
    marginBottom: 2,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 18,
      marginRight: 0,
    },
  },
  marginRight8: {
    marginRight: 8,
  },
  tableRowItem: {
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    width: "100%",
    padding: "8px 0",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  link: {
    color: colors.BLUE(1),
    fontWeight: "normal",
    textDecoration: "none",
  },
  padding8: {
    padding: 8,
  },
  itemCenterAlign: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    padding: "unset",
  },
  commentsIcon: {
    cursor: "pointer",
    fontSize: 20,
  },
  paddingRight16: {
    paddingRight: 16,
  },
  paddingBottom4: {
    paddingBottom: 4,
  },
});
