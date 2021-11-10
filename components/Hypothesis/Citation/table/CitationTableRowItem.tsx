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
import CitationVoteItem from "./CitationVoteItem";
import { ValidCitationType } from "../modal/AddNewSourceBodySearch";
import { breakpoints } from "~/config/themes/screen";

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
  const isSupportSource = type === "SUPPORT";

  return (
    <div className={css(styles.tableRowItem)}>
      <ItemColumn
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
        value={<AuthorFacePile authorProfiles={citedBy} imgSize={24} />}
        width={tableWidths.CITED_BY}
      />
      <ItemColumn
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
