import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { formatUploadedDate } from "~/config/utils/dates";
import { isDevEnv } from "~/config/utils/env";
import { SyntheticEvent, useState, useEffect, useMemo } from "react";
import { transformDate } from "~/redux/utils";
import { UPVOTE, DOWNVOTE, userVoteToConstant } from "~/config/constants";
import API from "~/config/api";
import AuthorAvatar from "../../AuthorAvatar";
import colors, { genericCardColors } from "~/config/themes/colors";
import DesktopOnly from "../../DesktopOnly";
import HubDropDown from "../../Hubs/HubDropDown";
import HubTag from "../../Hubs/HubTag";
import icons, { PaperDiscussionIcon } from "~/config/themes/icons";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import MobileOnly from "../../MobileOnly";
import ResponsivePostVoteWidget from "~/components/Author/Tabs/ResponsivePostVoteWidget";
import Ripples from "react-ripples";
import Router from "next/router";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import CitationConsensusItem from "~/components/Hypothesis/Citation/table/CitationConsensusItem";
import { breakpoints } from "~/config/themes/screen";

export type HypothesisCardProps = {
  aggregate_citation_consensus: any;
  boost_amount: number;
  created_by: any;
  created_date: any;
  discussion_count: number;
  formattedDocType: string | null;
  hubs: any[];
  id: number;
  preview_img: string;
  renderable_text: string;
  renderableTextAsHtml: any;
  score: number;
  slug: string;
  style: StyleSheet;
  styleVariation: string;
  title: string;
  titleAsHtml: any;
  unified_document_id: number;
  unified_document: any;
  user_vote: any;
  user: any;
};

const renderMetadata = (created_date, mobile = false) => {
  if (created_date) {
    return <div>{renderUploadedDate(created_date, mobile)}</div>;
  }
};

const renderUploadedDate = (created_date, mobile) => {
  if (created_date) {
    const formattedDate = formatUploadedDate(
      transformDate(created_date),
      mobile
    );
    if (!mobile) {
      return (
        <div className={css(styles.metadataContainer, styles.publishContainer)}>
          <span className={css(styles.metadataText)}>{formattedDate}</span>
        </div>
      );
    } else {
      return (
        <div className={css(styles.metadataContainer, styles.publishContainer)}>
          <span>{icons.calendar}</span>
          <span className={css(styles.metadataText)}>{formattedDate}</span>
        </div>
      );
    }
  }
};

function HypothesisCard({
  aggregate_citation_consensus: aggreCitationCons,
  boost_amount: boostAmount,
  created_by,
  created_date,
  discussion_count: discussionCount,
  formattedDocType,
  hubs,
  id,
  preview_img: previewImg,
  renderable_text: renderableText,
  renderableTextAsHtml,
  score: initialScore,
  slug,
  style,
  styleVariation,
  title,
  titleAsHtml,
  user_vote: userVote,
  user: currentUser,
}: HypothesisCardProps) {
  if (created_by == null) {
    return null;
  }

  const {
    author_profile: { first_name, last_name, author },
  } = created_by;

  const [voteState, setVoteState] = useState<string | null>(
    userVoteToConstant(userVote)
  );
  const [score, setScore] = useState<number>(initialScore + (boostAmount ?? 0));
  const [isHubsOpen, setIsHubsOpen] = useState(false);

  useEffect((): void => {
    setVoteState(userVoteToConstant(userVote));
  }, [userVote]);

  const mainTitle = (
    <Link
      href={"/[docType]/[documentId]/[title]"}
      as={`/${formattedDocType}/${id}/${slug}`}
    >
      <a
        className={css(styles.link)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span className={css(styles.title)}>
          {titleAsHtml ? titleAsHtml : title ? title : ""}
        </span>
      </a>
    </Link>
  );

  const previewImgComponent = useMemo(() => {
    if (Boolean(previewImg)) {
      return (
        <div
          className={css(styles.column, styles.previewColumn)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={css(styles.preview)}>
            <LazyLoad offset={100} once>
              <img src={previewImg} className={css(styles.image)} />
            </LazyLoad>
          </div>
        </div>
      );
    } else {
      return (
        <div className={css(styles.column, styles.previewColumn)}>
          <div className={css(styles.preview, styles.previewEmpty)} />
        </div>
      );
    }
  }, [previewImg]);

  const creatorTag = (
    <div className={css(styles.postCreatedBy)}>
      <LazyLoad offset={100} once>
        <AuthorAvatar
          author={created_by.author_profile}
          size={28}
          border="2px solid #F1F1F1"
        />
      </LazyLoad>
    </div>
  );

  const hubTags = useMemo(() => {
    const firstTagSet = hubs
      .slice(0, 3)
      .map((tag, index) => (
        <HubTag
          key={`hub_${index}`}
          tag={tag}
          last={index === hubs.length - 1}
          labelStyle={
            hubs.length >= 3 ? styles.smallerHubLabel : styles.hubLabel
          }
        />
      ));
    return (
      <div className={css(styles.tags)}>
        {firstTagSet}
        {hubs.length > 3 && (
          <HubDropDown
            hubs={hubs}
            labelStyle={styles.hubLabel}
            isOpen={isHubsOpen}
            setIsOpen={setIsHubsOpen}
          />
        )}
      </div>
    );
  }, [hubs]);

  const createVoteHandler = (voteType) => {
    const voteStrategies = {
      [UPVOTE]: {
        increment: 1,
        getUrl: API.HYPOTHESIS_VOTE({ hypothesisID: id, voteType }),
      },
      [DOWNVOTE]: {
        increment: -1,
        getUrl: API.HYPOTHESIS_VOTE({ hypothesisID: id, voteType }),
      },
    };

    const { increment, getUrl } = voteStrategies[voteType];

    const handleVote = async () => {
      const response = await fetch(getUrl, API.POST_CONFIG()).catch((err) =>
        emptyFncWithMsg(err)
      );

      return response;
    };

    return async (e: SyntheticEvent) => {
      e.stopPropagation();

      if (
        !isNullOrUndefined(currentUser) &&
        currentUser?.id === created_by?.id
      ) {
        emptyFncWithMsg("Not logged in or Attempted to vote own hypothesis");
        return;
      }

      if (voteState === voteType) {
        return;
      } else {
        setVoteState(voteType);
        if (Boolean(voteState) /* implies user already voted */) {
          setScore(score + increment * 2);
        } else {
          // User has not voted, so regular vote
          setScore(score + increment);
        }
      }

      await handleVote();
    };
  };

  const desktopVoteWidget = (
    <ResponsivePostVoteWidget
      onDesktop
      onDownvote={createVoteHandler(DOWNVOTE)}
      onUpvote={createVoteHandler(UPVOTE)}
      score={score}
      voteState={voteState}
    />
  );

  const mobileVoteWidget = (
    <ResponsivePostVoteWidget
      onDesktop={false}
      onDownvote={createVoteHandler(DOWNVOTE)}
      onUpvote={createVoteHandler(UPVOTE)}
      score={score}
      voteState={voteState}
    />
  );

  const mobileCreatorTag = <MobileOnly> {creatorTag} </MobileOnly>;
  const discussionCountComponent =
    discussionCount === 0 ? null : (
      <Link
        href={"/[documentType]/[documentId]/[title]"}
        as={`/${formattedDocType}/${id}/${slug}`}
      >
        <a
          className={css(styles.link)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={css(styles.discussion)}>
            <div className={css(styles.discussionIcon)} id={"discIcon"}>
              {PaperDiscussionIcon({ color: undefined })}
            </div>
            <div className={css(styles.discussionCount)} id={"discCount"}>
              {discussionCount}
            </div>
          </div>
        </a>
      </Link>
    );

  const navigateToPage = (e) => {
    if (e.metaKey || e.ctrlKey) {
      window.open(`/${formattedDocType}/${id}/${slug}`, "_blank");
    } else {
      Router.push(
        "/[documentType]/[documentId]/[title]",
        `/${formattedDocType}/${id}/${slug}`
      );
    }
  };

  const metadata = renderMetadata(created_date);

  return (
    <Ripples
      className={css(
        styles.HypothesisCard,
        styleVariation && styles[styleVariation],
        style && style,
        isHubsOpen && styles.overflow
      )}
      onClick={navigateToPage}
      key={`${formattedDocType}-${id}`}
      data-test={isDevEnv() ? `document-${id}` : undefined}
    >
      <DesktopOnly>
        <div className={css(styles.leftSection)}>
          {desktopVoteWidget}
          <div className={css(styles.discussionCountContainer)}>
            {discussionCountComponent}
          </div>
        </div>
      </DesktopOnly>
      <div className={css(styles.container)}>
        <div className={css(styles.rowContainer)}>
          <div className={css(styles.column, styles.metaData)}>
            <div className={css(styles.topRow)}>
              {mobileVoteWidget}
              <MobileOnly> {discussionCountComponent}</MobileOnly>
              <DesktopOnly> {mainTitle} </DesktopOnly>
            </div>
            <MobileOnly> {mainTitle} </MobileOnly>
            {metadata}
            <div className={css(styles.summaryWrap)}>
              <div className={css(styles.summary) + " clamp2"}>
                {renderableTextAsHtml
                  ? renderableTextAsHtml
                  : renderableText
                  ? renderableText
                  : ""}
              </div>
              <div className={css(styles.consensusContainer)}>
                <CitationConsensusItem
                  citationID={`${id}-citation-placeholder`}
                  consensusMeta={{
                    downCount: aggreCitationCons?.down_count ?? 0,
                    neutralCount: aggreCitationCons?.neutral_count ?? 0,
                    totalCount: aggreCitationCons?.citation_count ?? 0,
                    upCount: aggreCitationCons?.up_count ?? 0,
                    userVote: {},
                  }}
                  shouldAllowVote={false}
                  updateLastFetchTime={silentEmptyFnc}
                />
              </div>
            </div>
            {mobileCreatorTag}
          </div>
          <DesktopOnly> {previewImgComponent} </DesktopOnly>
        </div>
        <div className={css(styles.bottomBar)}>
          <div className={css(styles.rowContainer)}>
            <DesktopOnly> {creatorTag} </DesktopOnly>
          </div>
          <DesktopOnly>
            <div className={css(styles.row)}>{hubTags}</div>
          </DesktopOnly>
        </div>
        <MobileOnly>
          <div className={css(styles.bottomBar, styles.mobileHubTags)}>
            {hubTags}
          </div>
        </MobileOnly>
      </div>
    </Ripples>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HypothesisCard);

/**
 * Styles taken from PaperEntryCard.js
 * If style does not appear correct, check if Paper Entry Cards
 * are behaving the same way. If not, refer to PaperEntryCard.js styles
 */
const styles = StyleSheet.create({
  HypothesisCard: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3,
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  discussion: {
    cursor: "pointer",
    position: "relative",
    fontSize: 14,
    background: colors.LIGHTER_GREY_BACKGROUND,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 13,
    "@media only screen and (max-width: 967px)": {
      minWidth: "unset",
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  discussionCount: {
    color: "rgb(71 82 93 / 80%)",
    fontWeight: "bold",
    marginLeft: 6,
  },
  discussionIcon: {
    color: "#ededed",
  },
  discussionCountContainer: {
    marginTop: 8,
    marginRight: 17,
  },
  leftSection: {
    width: 60,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },

  noBorderVariation: {
    border: 0,
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    marginBottom: 0,
    marginTop: 0,
    ":last-child": {
      borderBottom: 0,
    },
  },
  overflow: {
    overflow: "visible",
  },
  postCreatedBy: {
    display: "flex",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 8,
    },
  },
  postContent: {},
  creatorName: {
    fontSize: 18,
    fontWeight: 400,
    marginLeft: 8,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
    },
  },
  image: {
    objectFit: "contain",
    maxHeight: 90,
    height: 90,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  },
  rowContainer: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    position: "relative",
  },
  metaData: {
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    justifyContent: "space-between",
    marginRight: "8px",
  },
  metadataContainer: {
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: 5,
  },
  publishContainer: {
    marginRight: 10,
  },
  metadataText: {
    fontSize: 13,
    color: colors.BLACK(0.5),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
    },
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBottom: 8,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "space-between",
      paddingBottom: 10,
    },
  },
  consensusContainer: {
    boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 13,
      width: "30%",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 16,
      width: "100%",
    },
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  mobileHubTags: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "flex",
      width: "100%",
      justifyContent: "flex-end",
      marginTop: 0,
    },
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
  },
  title: {
    width: "100%",
    fontSize: 20,
    fontWeight: 500,
    color: colors.BLACK(),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
      paddingBottom: 10,
    },
  },
  preview: {
    height: 90,
    maxHeight: 90,
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  previewEmpty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "unset",
    backgroundColor: "unset",
    height: "unset",
    maxHeight: "unset",
    width: "unset",
    minWidth: "unset",
    maxWidth: "unset",
  },
  previewColumn: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  },
  summary: {
    width: "80%",
    boxSizing: "border-box",
    paddingRight: 16,
    color: colors.BLACK(0.8),
    fontSize: 14,
    lineHeight: 1.3,
    marginTop: 5,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 13,
      width: "70%",
      minWidth: "70%",
      maxWidth: "70%",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
      minWidth: "100%",
      maxWidth: "100%",
    },
  },
  summaryWrap: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      marginTop: 16,
      marginBottom: 16,
    },
  },
  row: {
    display: "flex",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      height: "unset",
      alignItems: "flex-start",
    },
  },
  hubLabel: {
    "@media only screen and (max-width: 415px)": {
      maxWidth: 60,
      flexWrap: "unset",
    },
  },
  smallerHubLabel: {
    maxWidth: 150,
    "@media only screen and (max-width: 415px)": {
      maxWidth: 60,
      flexWrap: "unset",
    },
  },
  tags: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap-reverse",
    marginLeft: "auto",
    width: "max-content",
    "@media only screen and (max-width: 970px)": {
      flexWrap: "wrap",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      margin: 0,
      padding: 0,
      width: "fit-content",
    },
  },
});
