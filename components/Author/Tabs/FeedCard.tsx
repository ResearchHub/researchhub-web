import API from "~/config/api";
import AuthorAvatar from "~/components/AuthorAvatar";
import DesktopOnly from "~/components/DesktopOnly";
import HubDropDown from "~/components/Hubs/HubDropDown";
import Link from "next/link";
import ResponsivePostVoteWidget from "~/components/Author/Tabs/ResponsivePostVoteWidget";
import Ripples from "react-ripples";
import colors, { genericCardColors } from "~/config/themes/colors";
import dynamic from "next/dynamic";
import icons from "~/config/themes/icons";
import { DOWNVOTE, UPVOTE, userVoteToConstant } from "~/config/constants";
import { ModalActions } from "~/redux/modals";
import { PaperActions } from "~/redux/paper";
import { SyntheticEvent, useState, useEffect } from "react";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg, isNullOrUndefined } from "~/config/utils/nullchecks";
import { formatDateStandard } from "~/config/utils/dates";
import { isDevEnv } from "~/config/utils/env";
import { transformDate } from "~/redux/utils";
import ScoreInput from "~/components/Form/ScoreInput";
import ALink from "~/components/ALink";
import PeerReviewScoreSummary from "~/components/PeerReviews/PeerReviewScoreSummary";

const PaperPDFModal = dynamic(
  () => import("~/components/Modals/PaperPDFModal")
);

export type FeedCardProps = {
  abstract: string;
  created_by: any;
  created_date: any;
  discussion_count: number;
  first_figure: any;
  first_preview: any;
  formattedDocType: string | null;
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

function FeedCard(props: FeedCardProps) {
  const {
    abstract,
    created_by,
    created_date,
    discussion_count,
    first_figure,
    first_preview,
    formattedDocType,
    hubs,
    id,
    index,
    onBadgeClick,
    paper,
    postDownvote,
    postUpvote,
    preview_img: previewImg,
    renderableTextAsHtml,
    renderable_text: renderableText,
    reviews,
    score: initialScore,
    singleCard,
    slug,
    title,
    titleAsHtml, // In some contexts we want to wrap the title/renderable_text with html. e.g. rendering search highlights.
    unified_document: unifiedDocument,
    unified_document_id: unifiedDocumentId,
    uploaded_by,
    uploaded_date,
    user: currentUser,
    user_vote: userVote,
    voteCallback,
  } = props;

  /**
   * Whether or not THIS PaperPDFModal is open.
   * There may be many PaperPDFModal components on the page, but
   * modals.openPaperPDFModal is only a single boolean. So all cards
   * must only render their PaperPDFModal component if requested */
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [voteState, setVoteState] = useState<string | null>(
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
  const docUrl = `/${formattedDocType}/${id}/${slug ?? "new-paper"}`;

  useEffect((): void => {
    setVoteState(userVoteToConstant(userVote));
  }, [userVote]);

  function configurePreview(arr) {
    return arr.filter((el) => {
      return !isNullOrUndefined(el);
    });
  }

  const createVoteHandler = (voteType) => {
    const voteStrategies = {
      [UPVOTE]: {
        increment: 1,
        getUrl:
          formattedDocType === "post"
            ? API.RH_POST_UPVOTE(id)
            : API.HYPOTHESIS_VOTE({ hypothesisID: id, voteType }),
      },
      [DOWNVOTE]: {
        increment: -1,
        getUrl:
          formattedDocType === "post"
            ? API.RH_POST_DOWNVOTE(id)
            : API.HYPOTHESIS_VOTE({ hypothesisID: id, voteType }),
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
      e.preventDefault();
      e.stopPropagation();

      if (
        !isNullOrUndefined(currentUser) &&
        currentUser.id === created_by.author_profile.id
      ) {
        emptyFncWithMsg(
          `Not logged in or attempted to vote on own ${formattedDocType}.`
        );
        return;
      }

      if (voteState === voteType) {
        return;
      } else {
        setVoteState(voteType);
        setScore(score + (Boolean(voteState) ? increment * 2 : increment));
      }

      await handleVote();
    };
  };

  async function onPaperVote(voteType) {
    const curPaper = { ...paper };
    const increment = voteType === UPVOTE ? 1 : -1;
    setVoteState(voteType);
    setScore(score + (Boolean(voteState) ? increment * 2 : increment));
    voteCallback && voteCallback(index, curPaper);
    if (voteType === UPVOTE) {
      postUpvote(curPaper.id);
    } else {
      postDownvote(curPaper.id);
    }
  }

  const documentIcons = {
    paper: icons.paperRegular,
    post: icons.penSquare,
    hypothesis: icons.lightbulb,
  };
  const resolvedHubs = hubs ?? [];

  return (
    <Ripples
      className={css(
        styles.ripples,
        singleCard ? styles.fullBorder : styles.noBorder,
        isHubsOpen && styles.overflow
      )}
      data-test={isDevEnv() ? `document-${id}` : undefined}
      key={`${formattedDocType}-${id}`}
      onClick={props?.handleClick}
    >
      <Link href={`/${formattedDocType}/${id}/${slug ?? "new-paper"}`}>
        <a className={css(styles.feedCard)}>
          <DesktopOnly>
            <div className={css(styles.leftSection)}>
              <ResponsivePostVoteWidget
                onDesktop
                onDownvote={
                  formattedDocType === "paper"
                    ? (e) => {
                        e.preventDefault();
                        onPaperVote(DOWNVOTE);
                      }
                    : createVoteHandler(DOWNVOTE)
                }
                onUpvote={
                  formattedDocType === "paper"
                    ? (e) => {
                        e.preventDefault();
                        onPaperVote(UPVOTE);
                      }
                    : createVoteHandler(UPVOTE)
                }
                score={score}
                voteState={voteState}
              />
            </div>
          </DesktopOnly>
          <div className={css(styles.container)}>
            <div className={css(styles.fullWidth)}>
              <div className={css(styles.rowContainer)}>
                <div className={css(styles.postCreatedBy)}>
                  {uploaded_by || created_by ? (
                    <AuthorAvatar
                      author={
                        created_by?.author_profile ||
                        uploaded_by?.author_profile
                      }
                      boldName
                      border="2px solid #F1F1F1"
                      fontSize={15}
                      size={20}
                      spacing={5}
                      withAuthorName
                    />
                  ) : null}
                  {(uploaded_by || created_by) && hubs.length > 0 && (
                    <div className={css(styles.textLabel)}>uploaded in</div>
                  )}
                  {hubs?.slice(0, 7).map((tag, index) => (
                    <Link href={`/hubs/${tag.slug}`}>
                      <a
                        className={css(styles.hubLabel)}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >{`${tag.name}${resolvedHubs.length > 7 ? "," : ""}`}</a>
                    </Link>
                  ))}
                  {resolvedHubs.length > 7 && (
                    <HubDropDown
                      hubs={hubs}
                      labelStyle={styles.hubLabel}
                      isOpen={isHubsOpen}
                      setIsOpen={setIsHubsOpen}
                    />
                  )}
                  <div className={css(styles.textLabel, styles.noMargin)}>
                    <span className={css(styles.metadataText)}>
                      on{" "}
                      {formatDateStandard(
                        transformDate(created_date || uploaded_date)
                      )}
                    </span>
                  </div>
                </div>
                {!Boolean(previewImg) && previews.length === 0 && (
                  <span className={css(styles.row, styles.docType)}>
                    <span className={css(styles.metadataIcon)}>
                      {documentIcons[formattedDocType!]}
                    </span>
                    <span>{formattedDocType}</span>
                  </span>
                )}
              </div>
              <div className={css(styles.rowContainer)}>
                <div className={css(styles.column, styles.metaData)}>
                  <span className={css(styles.title)}>
                    {titleAsHtml ? titleAsHtml : title ? title : ""}
                  </span>
                  {abstract && (
                    <div className={css(styles.abstract) + " clamp2"}>
                      {abstract}
                    </div>
                  )}
                  {reviews?.count > 0 && (
                    <div className={css(styles.reviewSummaryContainer)}>
                      <PeerReviewScoreSummary
                        summary={reviews}
                        docUrl={docUrl}
                      />
                    </div>
                  )}
                  <div
                    className={css(
                      styles.metadataContainer,
                      styles.publishContainer
                    )}
                  >
                    <div
                      className={css(
                        styles.upvoteMetadata,
                        styles.metadataIcon
                      )}
                    >
                      {icons.upRegular}
                    </div>
                    <span
                      className={css(
                        styles.upvoteMetadata,
                        styles.metadataText
                      )}
                    >
                      <span className={css(styles.boldText)}>{score}</span>
                    </span>
                    <div className={css(styles.metadataIcon)}>
                      {icons.commentRegular}
                    </div>
                    <span className={css(styles.metadataText)}>
                      <span className={css(styles.boldText)}>
                        {discussion_count}
                      </span>
                      <span className={css(styles.hideTextMobile)}>{` Comment${
                        discussion_count === 1 ? "" : "s"
                      }`}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={css(styles.column)}>
              {(Boolean(previewImg) || previews.length > 0) && (
                <span className={css(styles.row, styles.docType)}>
                  <span className={css(styles.metadataIcon)}>
                    {documentIcons[formattedDocType!]}
                  </span>
                  <span>{formattedDocType}</span>
                </span>
              )}
              {Boolean(previewImg) && (
                <div className={css(styles.preview, styles.imagePreview)}>
                  <img src={previewImg} className={css(styles.image)} />
                </div>
              )}
              {previews.length > 0 && (
                <div
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
                  <div className={css(styles.preview, styles.paperPreview)}>
                    <img
                      src={previews[0].file}
                      className={css(styles.image)}
                      key={`preview_${previews[0].file}`}
                      alt={`Paper Preview Page 1`}
                      onClick={(e) => {
                        e && e.preventDefault();
                        e && e.stopPropagation();
                        setIsPreviewing(true);
                        props.openPaperPDFModal(true);
                      }}
                    />
                  </div>
                </div>
              )}
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
    justifyContent: "space-between",
  },
  image: {
    objectFit: "contain",
    maxHeight: 90,
    height: 90,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  fullWidth: {
    width: "100%",
  },
  rowContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  column: {
    alignContent: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    position: "relative",
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  docType: {
    color: colors.BLACK(0.5),
    display: "flex",
    fontSize: 14,
    justifyContent: "flex-end",
    marginBottom: 8,
    textTransform: "capitalize",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 13,
    },
  },
  abstract: {
    color: colors.BLACK(0.6),
    marginBottom: 10,
    fontSize: 15,
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
  },
  metadataText: {
    color: colors.BLACK(0.5),
    fontSize: 14,
    marginRight: 15,
    // textTransform: "capitalize",
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 13,
    },
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
    marginBottom: 10,
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
    color: colors.BLACK(),
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    marginTop: 7,
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
  paperPreview: {
    height: 80,
    width: 70,
  },
  textLabel: {
    color: colors.TEXT_GREY(),
    fontSize: 15,
    fontWeight: 500,
    margin: "0px 5px",
  },
  noMargin: {
    margin: 0,
  },
  hubLabel: {
    color: colors.NEW_BLUE(),
    fontSize: 15,
    fontWeight: 500,
    marginRight: 5,
    textDecoration: "none",
    textTransform: "capitalize",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  leftSection: {
    width: 60,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  boldText: {
    fontWeight: 700,
  },
  metadataIcon: {
    color: colors.BLACK(0.5),
    fontSize: 14,
    marginRight: 5,
  },
  reviewSummaryContainer: {
    marginBottom: 10,
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
