import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faCommentAltLines,
  faCheck,
  faQuestion,
  faPenSquare,
} from "@fortawesome/pro-solid-svg-icons";
import { faLightbulb, faFileLines } from "@fortawesome/pro-regular-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import { connect, useDispatch } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import {
  DOWNVOTE,
  NEUTRALVOTE,
  UPVOTE,
  userVoteToConstant,
} from "~/config/constants";
import {
  emptyFncWithMsg,
  isEmpty,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import { isDevEnv } from "~/config/utils/env";
import { ModalActions } from "~/redux/modals";
import { PaperActions } from "~/redux/paper";
import { ID, RhDocumentType, parseUser } from "~/config/types/root_types";
import { useState, useEffect, SyntheticEvent } from "react";
import colors, {
  genericCardColors,
  voteWidgetColors,
} from "~/config/themes/colors";
import DesktopOnly from "~/components/DesktopOnly";
import dynamic from "next/dynamic";

import PeerReviewScoreSummary from "~/components/PeerReviews/PeerReviewScoreSummary";
import ResponsivePostVoteWidget from "~/components/Author/Tabs/ResponsivePostVoteWidget";
import Ripples from "react-ripples";
import VoteWidget from "~/components/VoteWidget";
import { createVoteHandler } from "~/components/Vote/utils/createVoteHandler";
import { unescapeHtmlString } from "~/config/utils/unescapeHtmlString";
import { RESEARCHHUB_POST_DOCUMENT_TYPES } from "~/config/utils/getUnifiedDocType";
import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import ContentBadge from "~/components/ContentBadge";
import { useRouter } from "next/router";
import Link from "next/link";
import { parsePaperAuthors } from "~/components/Document/lib/types";
import AuthorList from "../AuthorList";
import { parseHub } from "~/config/types/hub";
import DocumentHubs from "~/components/Document/lib/DocumentHubs";

const DocumentViewer = dynamic(
  () => import("~/components/Document/DocumentViewer")
);

export type FeedCardProps = {
  abstract: string;
  boost_amount: number;
  bounties: Bounty[];
  created_by: any;
  created_date: any;
  discussion_count: number;
  featured: boolean;
  first_figure: any;
  first_preview: any;
  formattedDocLabel?: string;
  formattedDocType: RhDocumentType | null;
  handleClick?: (SyntheticEvent) => void;
  hasAcceptedAnswer: boolean;
  hideVotes?: boolean;
  hubs: any[];
  id: number;
  index: number;
  onBadgeClick: any;
  paper: any;
  postDownvote: any;
  postUpvote: any;
  preview_img: string;
  renderable_text: string;
  renderableTextAsHtml: any;
  reviews: any;
  score: number;
  singleCard: boolean;
  slug: string;
  title: string;
  titleAsHtml: any;
  unified_document_id: number;
  unified_document: any;
  uploaded_by: any;
  uploaded_date: any;
  user_vote: any;
  user: any;
  voteCallback: any;
  withSidePadding?: boolean;
  type: string;
};

const documentIcons = {
  paper: <FontAwesomeIcon icon={faFileLines}></FontAwesomeIcon>,
  post: <FontAwesomeIcon icon={faPenSquare}></FontAwesomeIcon>,
  hypothesis: <FontAwesomeIcon icon={faLightbulb}></FontAwesomeIcon>,
  question: <FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon>,
};

function FeedCard({
  abstract,
  boost_amount: boostAmount,
  bounties,
  created_by,
  created_date,
  discussion_count,
  featured,
  first_figure,
  first_preview,
  type,
  formattedDocLabel,
  formattedDocType,
  handleClick,
  hasAcceptedAnswer,
  hideVotes,
  hubs,
  id,
  paper,
  preview_img: previewImg,
  renderable_text: renderableText,
  reviews,
  score: initialScore,
  singleCard,
  slug,
  title,
  titleAsHtml, // In some contexts we want to wrap the title/renderable_text with html. e.g. rendering search highlights.
  uploaded_by,
  uploaded_date,
  user_vote: userVote,
  user: currentUser,
  withSidePadding,
}: FeedCardProps) {
  const authors = parsePaperAuthors(paper);
  const parsedHubs = hubs.map(parseHub);
  const router = useRouter();
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [voteState, setVoteState] = useState<VoteType | null>(
    userVoteToConstant(userVote)
  );
  const [score, setScore] = useState<number>(initialScore);
  const [rscBadgeHover, setRSCBadgeHover] = useState(false);
  const [previews] = useState(
    configurePreview([
      first_preview && first_preview,
      first_figure && first_figure,
    ])
  );

  // const bounty = bounties?.[0];
  const feDocUrl = `/${
    RESEARCHHUB_POST_DOCUMENT_TYPES.includes(formattedDocType ?? "")
      ? "post"
      : formattedDocType
  }/${id}/${slug ?? "new"}`;

  const dispatch = useDispatch();

  useEffect((): void => {
    if (!isEmpty(userVote)) {
      setVoteState(userVoteToConstant(userVote));
    }
  }, [userVote]);

  function configurePreview(arr) {
    return arr.filter((el) => {
      return !isNullOrUndefined(el);
    });
  }

  const onDownvote = createVoteHandler({
    currentAuthor: currentUser?.author_profile,
    currentVote: voteState,
    documentCreatedBy: created_by ?? uploaded_by,
    documentID: id,
    documentType: nullthrows(formattedDocType, "Cannot vote without doctype"),
    onError: emptyFncWithMsg,
    onSuccess: ({ increment, voteType }): void => {
      setVoteState(voteType);
      setScore(score + increment);
    },
    voteType: DOWNVOTE,
    dispatch,
  });

  const onUpvote = createVoteHandler({
    currentAuthor: currentUser?.author_profile,
    currentVote: voteState,
    documentCreatedBy: created_by ?? uploaded_by,
    documentID: id,
    documentType: nullthrows(formattedDocType, "Cannot vote without doctype"),
    onError: emptyFncWithMsg,
    onSuccess: ({ increment, voteType }): void => {
      setVoteState(voteType);
      setScore(score + increment);
    },
    voteType: UPVOTE,
    dispatch,
  });

  const onNeutralVote = createVoteHandler({
    dispatch,
    currentAuthor: currentUser?.author_profile,
    currentVote: voteState,
    documentCreatedBy: created_by ?? uploaded_by,
    documentID: id,
    documentType: nullthrows(formattedDocType, "Cannot vote without doctype"),
    onError: emptyFncWithMsg,
    onSuccess: ({ increment, voteType }): void => {
      if (voteType === NEUTRALVOTE) {
        if (voteState === UPVOTE) {
          setScore(score - 1);
        } else if (voteState === DOWNVOTE) {
          setScore(score + 1);
        }
      } else {
        setScore(score + increment);
      }
      setVoteState(voteType);
    },
    voteType: NEUTRALVOTE,
  });

  const getTitle = () => {
    if (titleAsHtml) {
      return titleAsHtml;
    }
    return unescapeHtmlString(title ?? "");
  };

  const getBody = () => {
    return abstract || renderableText;
  };

  const user = uploaded_by || created_by;
  const cardTitle = getTitle();
  const cardBody = getBody();
  let bountyAmount = 0;
  let hasActiveBounty = false;
  bounties &&
    bounties.forEach((bounty) => {
      bountyAmount += bounty.amount;
      if (!bounty.isExpiredOrClosed) {
        hasActiveBounty = true;
      }
    });

  return (
    <Ripples
      className={css(
        styles.ripples,
        singleCard ? styles.fullBorder : styles.noBorder
      )}
      data-test={isDevEnv() ? `document-${id}` : undefined}
      key={`${formattedDocType}-${id}`}
      onClick={(event) => {
        handleClick && handleClick(event);
      }}
    >
      <Link href={feDocUrl} className={css(styles.link)}>
        <div
          className={css(
            styles.feedCard,
            featured && styles.featuredContainer,
            withSidePadding && styles.padding16,
            type === "upload-paper" && styles.paperUploadCard
          )}
        >
          {!hideVotes && (
            <DesktopOnly>
              <div className={css(styles.leftSection)}>
                {/* TODO: migrate to VoteWidgetV2 */}
                <ResponsivePostVoteWidget
                  onDesktop
                  onNeutralVote={onNeutralVote}
                  onDownvote={onDownvote}
                  onUpvote={onUpvote}
                  score={score}
                  voteState={voteState}
                />
              </div>
            </DesktopOnly>
          )}
          <div className={css(styles.container)}>
            <div>
              {featured && (
                <div className={css(styles.featuredBadge)}>Featured</div>
              )}
              <div className={css(styles.rowContainer)}>
                <div className={css(styles.column, styles.metaData)}>
                  <div className={css(styles.rowContainer)}>
                    <div className={css(styles.cardBody)}>
                      <h2 className={css(styles.title)}>{cardTitle}</h2>
                      <div className={css(styles.authorWrapper)}>
                        <AuthorList
                          authors={authors}
                          moreAuthorsBtnStyle={styles.moreAuthorsBtnStyle}
                        />
                      </div>

                      {cardBody && (
                        <div className={css(styles.abstract) + " clamp2"}>
                          {cardBody}
                        </div>
                      )}
                    </div>
                    {previews.length > 0 && (
                      <div
                        className={css(styles.column, styles.previewSide)}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div
                          className={css(styles.preview, styles.paperPreview)}
                        >
                          <img
                            src={previews[0].file}
                            className={css(styles.image)}
                            key={`preview_${previews[0].file}`}
                            alt={`Paper Preview Page 1`}
                            onClick={(e) => {
                              e && e.preventDefault();
                              e && e.stopPropagation();
                              setIsPreviewing(true);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={css(
                      styles.metadataContainer,
                      styles.publishContainer
                    )}
                  >
                    {!hideVotes && (
                      <div
                        className={css(
                          styles.metaItem,
                          styles.mobileVoteWidget
                        )}
                      >
                        {/* TODO: migrate to VoteWidgetV2 */}
                        <VoteWidget
                          horizontalView={true}
                          onDownvote={onDownvote}
                          onUpvote={onUpvote}
                          onNeutralVote={onNeutralVote}
                          score={score}
                          styles={styles.voteWidget}
                          upvoteStyleClass={styles.mobileVote}
                          downvoteStyleClass={styles.mobileVote}
                          type="Discussion"
                          selected={voteState}
                        />
                      </div>
                    )}
                    <div
                      className={css(styles.metaItem, styles.metaItemAsBadge)}
                    >
                      <ContentBadge
                        contentType={formattedDocType}
                        badgeOverride={styles.badge}
                      />
                      <DocumentHubs hubs={parsedHubs} withShowMore={false} />
                    </div>

                    <div
                      className={css(styles.metaItem)}
                      style={{ marginLeft: "auto" }}
                    >
                      <span className={css(styles.metadataIcon)}>
                        {<FontAwesomeIcon icon={faComments}></FontAwesomeIcon>}
                      </span>
                      <span className={css(styles.metadataText)}>
                        <span>{discussion_count}</span>
                        <span className={css(styles.hideTextMobile)}>
                          {` Comment${discussion_count === 1 ? "" : "s"}`}
                        </span>
                      </span>
                    </div>

                    {/* {hasActiveBounty && (
                      <div className={css(styles.metaItem)}>
                        <ContentBadge
                          contentType="bounty"
                          bountyAmount={bountyAmount}
                          label={
                            <div style={{ display: "flex", whiteSpace: "pre" }}>
                              <div style={{ flex: 1 }}>
                                {formatBountyAmount({
                                  amount: bountyAmount,
                                })}{" "}
                                RSC
                              </div>
                            </div>
                          }
                        />
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {isPreviewing && (
        <div onClick={(e) => e.stopPropagation()}>
          <DocumentViewer
            pdfUrl={paper.file || paper.pdf_url}
            expanded={true}
            showExpandBtn={false}
            onClose={() => setIsPreviewing(false)}
            documentInstance={{
              id: paper.id,
              type: "paper",
            }}
          />
        </div>
      )}
    </Ripples>
  );
}

const styles = StyleSheet.create({
  badge: {
    padding: "4px 12px",
    fontWeight: 400,
    marginRight: 10,
    borderRadius: "50px",
  },
  authorWrapper: {
    fontSize: 14,
    color: colors.BLACK(),
    marginBottom: 5,
  },
  moreAuthorsBtnStyle: {
    color: colors.BLACK(),
  },
  ripples: {
    display: "flex",
    width: "100%",
  },
  cardBody: {
    width: "100%",
  },
  feedCard: {
    alignItems: "flex-start",
    backgroundColor: "#FFF",
    cursor: "pointer",
    display: "flex",
    padding: "16px 0px",
    textDecoration: "none",
    width: "100%",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  paperUploadCard: {
    paddingLeft: 16,
    paddingRight: 16,
    borderTop: `1px solid ${genericCardColors.BORDER}`,
  },
  noBorder: {
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    marginBottom: 0,
    marginTop: 0,
    ":last-child": {
      borderRadius: "0px 0px 4px 4px",
    },
    ":only-child": {
      borderBottom: `1px solid ${genericCardColors.BORDER}`,
      borderRadius: 4,
    },
  },
  mobileVote: {
    fontSize: 14,
  },
  fullBorder: {
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    borderRadius: 4,
  },
  overflow: {
    overflow: "visible",
  },
  postCreatedBy: {
    alignItems: "center",
    display: "flex",
    gap: "4px 0px",
    marginBottom: 8,
    flexWrap: "wrap",

    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
  },
  image: {
    objectFit: "contain",
    maxHeight: 85,
    height: 85,
  },
  mobilePill: {
    fontSize: 14,
    color: voteWidgetColors.ARROW,
    background: "unset",
    width: "unset",
  },
  container: {
    alignItems: "center",
    width: "100%",
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
  previewSide: {
    marginLeft: 16,
  },
  metaData: {
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    justifyContent: "space-between",
    marginRight: "8px",
    color: colors.BLACK(0.6),
  },
  metadataContainer: {
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  publishContainer: {
    marginRight: 0,
    width: "100%",
  },
  metadataText: {
    fontSize: 14,

    textTransform: "capitalize",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 13,
      // marginRight: 24,
    },
  },
  metaItem: {
    marginRight: 10,
    marginBottom: 5,
    display: "flex",
    alignItems: "center",
    ":last-child": {
      marginRight: 0,
    },
  },
  rscToUsdAmount: {
    opacity: 0,
    width: "0px",
    height: "0px",
    overflow: "hidden",
    transition: "all .3s ease-in-out",
  },
  rscToUsdAmountFull: {
    width: "100%",
    height: "100%",
    opacity: 1,
  },
  metaItemAsBadge: {
    marginRight: 10,
  },
  hideTextMobile: {
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      display: "none",
    },
  },
  upvoteMetadata: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      display: "unset",
    },
  },
  mobileVoteWidget: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      display: "unset",
    },
  },
  voteWidget: {
    marginRight: 0,
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
  featuredBadge: {
    background: colors.BLUE(1),
    color: "#fff",
    padding: "4px 12px",
    marginTop: -15,
    marginBottom: 10,
    borderRadius: "0px 0px 4px 4px",
    width: "fit-content",
    fontSize: 14,
    fontWeight: 500,
  },
  featuredContainer: {
    background: colors.BLUE(0.03),
    border: `1px solid ${colors.BLUE(1)}`,
    borderRadius: 4,

    ":hover": {
      background: colors.BLUE(0.06),
    },
  },
  abstract: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.MEDIUM_GREY2(),
    marginBottom: 10,
    lineHeight: "18px",
  },
  title: {
    color: colors.BLACK(),
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 5,
    marginTop: 4,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 16,
      fontWeight: 500,
    },
  },
  preview: {
    alignItems: "center",
    backgroundColor: "#FFF",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
  },
  imagePreview: {
    borderRadius: 4,
    height: 70,
    width: 70,
  },
  separator: {
    background: "#C7C7C7",
    height: 5,
    width: 5,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "50%",
  },
  paperPreview: {
    height: 75,
    width: 70,
    position: "relative",
    border: `1px solid ${colors.LIGHT_GREY()}`,
    borderRadius: "4px",
    ":hover": {
      border: `1px solid ${colors.MEDIUM_GREY()}`,
    },
  },
  textLabel: {
    color: colors.TEXT_GREY(),
    fontSize: 15,
    fontWeight: 400,

    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  hubLabel: {
    fontSize: 15,
    fontWeight: 500,
    textDecoration: "none",
    textTransform: "capitalize",
    color: colors.BLACK(),
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  leftSection: {
    width: 60,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  metadataIcon: {
    color: "#918F9B",
    fontSize: 12,
    marginRight: 5,
  },
  reviewSummaryContainer: {
    marginRight: 16,
  },
  acceptedAnswer: {
    color: colors.DARK_GREEN(),
  },
  rscIcon: {
    display: "inline-flex",
    verticalAlign: "middle",
  },
  padding16: { padding: 16 },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  postDownvote: PaperActions.postDownvote,
  postUpvote: PaperActions.postUpvote,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedCard);
