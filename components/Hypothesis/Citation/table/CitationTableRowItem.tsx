import { breakpoints } from "~/config/themes/screen";
import { ConsensusMeta } from "./CitationConsensusItem";
import { css, StyleSheet } from "aphrodite";
import { formatUnifiedDocPageUrl } from "~/config/utils/url_patterns";
import { Fragment, ReactElement, ReactNode, SyntheticEvent } from "react";
import { ID } from "~/config/types/root_types";
import { tableMaxWidths, tableWidths } from "./constants/tableWidths";
import { ValidCitationType } from "../modal/AddNewSourceBodySearch";
import AuthorFacePile from "~/components/shared/AuthorFacePile";
import CitationVoteItem from "./CitationVoteItem";
import colors from "~/config/themes/colors";
import HypothesisUnduxStore from "../../undux/HypothesisUnduxStore";
import icons from "~/config/themes/icons";
import ReactTooltip from "react-tooltip";
import Ripples from "react-ripples";
import Router from "next/router";

export type CitationTableRowItemProps = {
  citationID: ID;
  citationUnidocID: ID;
  citationType: ValidCitationType;
  citedBy: Object[];
  consensusMeta: ConsensusMeta;
  source: {
    displayTitle: string;
    docType: string;
    documentID: ID;
    doi: ID;
    slug?: string | null;
  };
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
  citationType,
  citedBy,
  consensusMeta,
  source: { displayTitle, docType, documentID, doi, slug },
  updateLastFetchTime,
}: CitationTableRowItemProps): ReactElement<"div"> {
  const hypothesisUnduxStore = HypothesisUnduxStore.useStore();
  const citationTitleLinkUri = formatUnifiedDocPageUrl({
    docType,
    documentID,
    slug,
  });
  const isSupportSource = citationType === "SUPPORT";

  return (
    <Ripples
      className={css(styles.link)}
      onClick={(event: any) => {
        if (event.metaKey || event.ctrlKey) {
          window.open(citationTitleLinkUri, "_blank");
        } else {
          Router.push("/paper/[paperId]/[paperName]", citationTitleLinkUri);
        }
      }}
    >
      <div className={css(styles.tableRowItem)}>
        <ItemColumn
          maxWidth={tableMaxWidths.SOURCE}
          value={
            <div className={css(styles.sourceWrap)}>
              <div className={css(styles.voteItemWrap)}>
                <CitationVoteItem
                  citationID={citationID}
                  updateLastFetchTime={updateLastFetchTime}
                  voteMeta={{ ...consensusMeta }}
                />
              </div>
              <div className={css(styles.sourceWrapControl)}>
                <div className={css(styles.sourceTitle)}>{displayTitle}</div>
              </div>
            </div>
          }
          width={tableWidths.SOURCE}
        />
        <ItemColumn
          maxWidth={tableMaxWidths.DOI}
          value={
            <Fragment>
              <div
                data-tip
                data-for={`consensus-doi-text-${doi}`}
                className={css(styles.DOI)}
                onClick={(event: SyntheticEvent) => event.stopPropagation()}
              >
                {doi}
              </div>
              <ReactTooltip
                backgroundColor={colors.TOOLTIP_BACKGROUND_BLACK}
                effect="solid"
                id={`consensus-doi-text-${doi}`}
                place="top"
                textColor={colors.TOOLTIP_TEXT_COLOR_WHITE}
                type="dark"
                children={doi}
              />
            </Fragment>
          }
          width={tableWidths.DOI}
        />
        <ItemColumn
          maxWidth={tableMaxWidths.CITED_BY}
          className={[styles.itemCenterAlign]}
          value={
            <AuthorFacePile
              authorProfiles={citedBy}
              imgSize={24}
              loadOffset={360}
            />
          }
          width={tableWidths.CITED_BY}
        />
        <ItemColumn
          maxWidth={tableMaxWidths.COMMENTS}
          className={[styles.itemCenterAlign]}
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
        <ItemColumn
          maxWidth={tableMaxWidths.TYPE}
          className={[styles.itemCenterAlign]}
          value={
            <div
              className={css(
                styles.typeIcon,
                isSupportSource ? styles.green : styles.red
              )}
              role="none"
            >
              <div className={css(styles.typeContent)}>
                <span className={css(styles.iconWrap)}>
                  {isSupportSource ? icons.checkCircle : icons.timesCircle}
                </span>
                <span className={css(styles.typeText)}>
                  {isSupportSource ? "Support" : "Reject"}
                </span>
              </div>
            </div>
          }
          width={tableWidths.TYPE}
        />
      </div>
    </Ripples>
  );
}

const styles = StyleSheet.create({
  itemColumn: {
    // NOTE: this needs to match headerItem of CitationTableHeaderItem
    alignItems: "center",
    display: "flex",
    fontSize: 14,
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
  typeContent: {
    display: "block",
    fontSize: 12,
  },
  typeText: {
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  typeIcon: {
    alignItems: "center",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    width: 72,
    padding: 4,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 500,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      width: "unset",
    },
  },
  sourceWrapControl: {},
  sourceTitle: {
    boxSizing: "border-box",
    maxHeight: 32,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: 4,
  },
  green: {
    backgroundColor: colors.GREEN(1),
  },
  red: {
    backgroundColor: colors.RED(1),
  },
  iconWrap: {
    marginRight: 4,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
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
    padding: "8px",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  link: {
    color: "black",
    fontWeight: "normal",
    textDecoration: "none",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  paperPadding: {
    padding: 8,
    paddingLeft: 0,
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
  voteItemWrap: {
    marginRight: 8,
    minWidth: 40,
    width: 40,
  },
  sourceWrap: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
    [`@media only screen and (max-width:${breakpoints.xxsmall.str})`]: {
      minWidth: "120px",
    },
  },
  DOI: {
    boxSizing: "border-box",
    maxHeight: 32,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: 4,
    paddingLeft: 4,
  },
});
