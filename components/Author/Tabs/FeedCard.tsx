import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { DOWNVOTE, UPVOTE, userVoteToConstant } from "~/config/constants";
import {
  emptyFncWithMsg,
  isEmpty,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import { formatDateStandard } from "~/config/utils/dates";
import { isDevEnv } from "~/config/utils/env";
import { ModalActions } from "~/redux/modals";
import { PaperActions } from "~/redux/paper";
import { parseCreatedBy } from "~/config/types/contribution";
import {
  VoteType,
  RhDocumentType,
  NullableString,
} from "~/config/types/root_types";
import { SyntheticEvent, useState, useEffect } from "react";
import colors, {
  genericCardColors,
  voteWidgetColors,
} from "~/config/themes/colors";
import DesktopOnly from "~/components/DesktopOnly";
import dynamic from "next/dynamic";
import icons from "~/config/themes/icons";
import Link from "next/link";
import PeerReviewScoreSummary from "~/components/PeerReviews/PeerReviewScoreSummary";
import ResponsivePostVoteWidget from "~/components/Author/Tabs/ResponsivePostVoteWidget";
import Ripples from "react-ripples";
import SubmissionDetails from "~/components/Document/SubmissionDetails";
import VoteWidget from "~/components/VoteWidget";
import { createVoteHandler } from "~/components/Vote/utils/createVoteHandler";
import { unescapeHtmlString } from "~/config/utils/unescapeHtmlString";

const PaperPDFModal = dynamic(
  () => import("~/components/Modals/PaperPDFModal")
);

export type FeedCardProps = {
  abstract: string;
  created_by: any;
  created_date: any;
  featured: boolean;
  discussion_count: number;
  first_figure: any;
  first_preview: any;
  formattedDocLabel?: string;
  formattedDocType: RhDocumentType | null;
  hubs: any[];
  id: number;
  index: number;
  onBadgeClick: any;
  openPaperPDFModal: any;
  paper: any;
  postDownvote: any;
  postUpvote: any;
  preview_img: string;
  renderableTextAsHtml: any;
  renderable_text: string;
  reviews: any;
  score: number;
  singleCard: boolean;
  slug: string;
  title: string;
  titleAsHtml: any;
  unified_document: any;
  unified_document_id: number;
  uploaded_by: any;
  uploaded_date: any;
  user: any;
  user_vote: any;
  voteCallback: any;
  handleClick?: (SyntheticEvent) => void;
};

const documentIcons = {
  paper: icons.paperRegular,
  post: icons.penSquare,
  hypothesis: icons.lightbulb,
  question: icons.question,
};

function FeedCard({
  abstract,
  created_by,
  created_date,
  discussion_count,
  featured,
  first_figure,
  first_preview,
  formattedDocLabel,
  formattedDocType,
  handleClick,
  hubs,
  id,
  openPaperPDFModal,
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
}: FeedCardProps) {
  /**
   * Whether or not THIS PaperPDFModal is open.
   * There may be many PaperPDFModal components on the page, but
   * modals.openPaperPDFModal is only a single boolean. So all cards
   * must only render their PaperPDFModal component if requested */
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [voteState, setVoteState] = useState<VoteType | null>(
    userVoteToConstant(userVote)
  );
  const [score, setScore] = useState<number>(initialScore);
  const [isHubsOpen, setIsHubsOpen] = useState(false);
  const [previews] = useState(
    configurePreview([
      first_preview && first_preview,
      first_figure && first_figure,
    ])
  );
  const docUrl = `/${
    formattedDocType === "question" ? "post" : formattedDocType
  }/${id}/${slug ?? "new-paper"}`;

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
  });

  const createdDate = formatDateStandard(created_date || uploaded_date);
  const createdBy = parseCreatedBy(uploaded_by || created_by);

  return (
    <Ripples
      className={css(
        styles.ripples,
        singleCard ? styles.fullBorder : styles.noBorder,
        isHubsOpen && styles.overflow
      )}
      data-test={isDevEnv() ? `document-${id}` : undefined}
      key={`${formattedDocType}-${id}`}
      onClick={handleClick}
    >
      <Link href={docUrl}>
        <a
          className={css(styles.feedCard, featured && styles.featuredContainer)}
        >
          <DesktopOnly>
            <div className={css(styles.leftSection)}>
              {/* TODO: migrate to VoteWidgetV2 */}
              <ResponsivePostVoteWidget
                onDesktop
                onDownvote={onDownvote}
                onUpvote={onUpvote}
                score={score}
                voteState={voteState}
              />
            </div>
          </DesktopOnly>
          <div className={css(styles.container)}>
            <div>
              {featured && (
                <div className={css(styles.featuredBadge)}>Featured</div>
              )}
              <div className={css(styles.rowContainer)}>
                <SubmissionDetails
                  createdDate={createdDate}
                  hubs={hubs}
                  createdBy={createdBy}
                  avatarSize={20}
                />
              </div>
              <div className={css(styles.rowContainer)}>
                <div className={css(styles.column, styles.metaData)}>
                  <div className={css(styles.rowContainer)}>
                    <div>
                      <h2 className={css(styles.title)}>
                        {titleAsHtml
                          ? titleAsHtml
                          : unescapeHtmlString(title ?? "")}
                      </h2>
                      {(abstract || renderableText) && (
                        <div className={css(styles.abstract) + " clamp2"}>
                          {abstract || renderableText}
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
                        {isPreviewing && (
                          <PaperPDFModal
                            paper={paper}
                            onClose={() => setIsPreviewing(false)}
                          />
                        )}
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
                              openPaperPDFModal(true);
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
                    <div className={css(styles.mobileVoteWidget)}>
                      {/* TODO: migrate to VoteWidgetV2 */}
                      <VoteWidget
                        horizontalView={true}
                        onDownvote={onDownvote}
                        onUpvote={onUpvote}
                        score={score}
                        styles={styles.voteWidget}
                        upvoteStyleClass={styles.mobileVote}
                        downvoteStyleClass={styles.mobileVote}
                        type="Discussion"
                        selected={voteState}
                      />
                    </div>
                    <div className={css(styles.metaItem)}>
                      <span className={css(styles.metadataIcon)}>
                        {icons.commentRegular}
                      </span>
                      <span className={css(styles.metadataText)}>
                        <span>{discussion_count}</span>
                        <span
                          className={css(styles.hideTextMobile)}
                        >{` Comment${discussion_count === 1 ? "" : "s"}`}</span>
                      </span>
                    </div>

                    {reviews?.count > 0 && (
                      <div
                        className={css(
                          styles.reviewSummaryContainer,
                          styles.metaItem
                        )}
                      >
                        <PeerReviewScoreSummary
                          summary={reviews}
                          docUrl={docUrl}
                        />
                      </div>
                    )}
                    <div className={css(styles.metaItem)}>
                      <span className={css(styles.metadataIcon)}>
                        {documentIcons[formattedDocType!]}
                      </span>
                      <span className={css(styles.metadataText)}>
                        {formattedDocLabel ?? formattedDocType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </Ripples>
  );
}

const styles = StyleSheet.create({
  ripples: {
    display: "flex",
    width: "100%",
  },
  feedCard: {
    alignItems: "flex-start",
    backgroundColor: "#FFF",
    borderLeft: `1px solid ${genericCardColors.BORDER}`,
    borderRight: `1px solid ${genericCardColors.BORDER}`,
    cursor: "pointer",
    display: "flex",
    padding: 15,
    textDecoration: "none",
    width: "100%",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  noBorder: {
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    marginBottom: 0,
    marginTop: 0,
    ":first-child": {
      borderRadius: "4px 4px 0px 0px",
      borderTop: `1px solid ${genericCardColors.BORDER}`,
    },
    ":last-child": {
      borderRadius: "0px 0px 4px 4px",
    },
    ":only-child": {
      border: `1px solid ${genericCardColors.BORDER}`,
      borderRadius: 4,
    },
  },
  mobileVote: {
    fontSize: 14,
  },
  fullBorder: {
    border: `1px solid ${genericCardColors.BORDER}`,
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
    maxHeight: 90,
    height: 90,
  },
  mobilePill: {
    fontSize: 14,
    color: voteWidgetColors.ARROW,
    background: "unset",
    width: "unset",
  },
  container: {
    alignItems: "center",
    // display: "flex",
    // justifyContent: "space-between",
    width: "100%",
  },
  rowContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
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
  },
  metadataContainer: {
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
  },
  publishContainer: {
    marginRight: 10,
    width: "100%",
  },
  metadataText: {
    color: colors.BLACK(0.6),
    fontSize: 14,
    marginRight: 15,
    textTransform: "capitalize",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 13,
      marginRight: 24,
    },
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
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
    marginRight: 24,
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
    color: colors.BLACK(),
    marginBottom: 10,
    lineHeight: "18px",
  },
  title: {
    color: colors.BLACK(),
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 10,
    marginTop: 8,
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
    height: 80,
    width: 70,
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
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  openPaperPDFModal: ModalActions.openPaperPDFModal,
  postDownvote: PaperActions.postDownvote,
  postUpvote: PaperActions.postUpvote,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedCard);
