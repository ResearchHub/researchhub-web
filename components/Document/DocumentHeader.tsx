import { StyleSheet, css } from "aphrodite";
import {
  parseAuthorProfile,
  TopLevelDocument,
} from "~/config/types/root_types";
import { ReactElement, useEffect, useState } from "react";
import ALink from "../ALink";
import colors from "~/config/themes/colors";
import icons, { HypothesisIcon } from "~/config/themes/icons";
import ReactTooltip from "react-tooltip";
import DocumentActions from "./DocumentActions";
import VoteWidget from "../VoteWidget";
import { createVoteHandler } from "../Vote/utils/createVoteHandler";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import AuthorClaimModal from "~/components/AuthorClaimModal/AuthorClaimModal";
import { connect } from "react-redux";
import { breakpoints } from "~/config/themes/screen";
import DocumentHeaderPlaceholder from "../Placeholders/DocumentHeaderPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import SubmissionDetails from "./SubmissionDetails";
import Button from "../Form/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Args = {
  document: TopLevelDocument;
  onDocumentRemove: Function;
  onDocumentRestore: Function;
  handleEdit: Function;
  auth: any;
  openPaperPDFModal?: Function;
  currentUser?: any;
};

function DocumentHeader({
  document,
  onDocumentRemove,
  onDocumentRestore,
  handleEdit,
  auth,
  openPaperPDFModal,
  currentUser,
}: Args): ReactElement<"div"> {
  const {
    title,
    createdBy,
    createdDate,
    authors,
    unifiedDocument,
    formats,
    externalUrl,
    doi,
    datePublished,
    journal,
    discussionCount,
    userVote,
    score,
    hubs,
    isOpenAccess,
  } = document;

  const currentAuthor = parseAuthorProfile(currentUser.author_profile);
  const [isAuthorClaimModalOpen, setIsAuthorClaimModalOpen] = useState(false);
  const [voteState, setVoteState] = useState({
    userVote: userVote,
    voteScore: score,
  });

  useEffect(() => {
    const isSubmittedByCurrentUser =
      currentUser && currentUser?.id === createdBy?.id;
    if (isSubmittedByCurrentUser) {
      setVoteState({
        ...voteState,
        userVote: UPVOTE,
        voteScore: document.score,
      });
    } else {
      setVoteState({
        ...voteState,
        userVote: document.userVote,
        voteScore: document.score,
      });
    }
  }, [currentUser, document]);

  const handleVoteSuccess = ({ voteType, increment }) => {
    let newVoteScore = voteState.voteScore;
    if (voteType === UPVOTE) {
      if (voteState.userVote === DOWNVOTE) {
        newVoteScore = voteState.voteScore + increment + 1;
      } else if (voteState.userVote === UPVOTE) {
        // This shouldn't happen but if it does, we do nothing
        console.log("User already casted upvote");
        return;
      } else {
        newVoteScore = voteState.voteScore + increment;
      }
    } else if (voteType === DOWNVOTE) {
      if (voteState.userVote === DOWNVOTE) {
        console.log("User already casted downvote");
        return;
      } else if (voteState.userVote === UPVOTE) {
        newVoteScore = voteState.voteScore + increment - 1;
      } else {
        newVoteScore = voteState.voteScore + increment;
      }
    }

    setVoteState({
      userVote: voteType,
      voteScore: newVoteScore,
    });
  };

  let onUpvote, onDownvote;
  if (document.isReady) {
    onUpvote = createVoteHandler({
      voteType: UPVOTE,
      unifiedDocument,
      currentAuthor,
      onSuccess: handleVoteSuccess,
      onError: () => null,
    });
    onDownvote = createVoteHandler({
      voteType: DOWNVOTE,
      unifiedDocument,
      currentAuthor,
      onSuccess: handleVoteSuccess,
      onError: () => null,
    });
  }

  const authorElems = (authors || []).map((author, idx) => {
    const lastElem = idx < authors.length - 1;
    return (
      <span className={css(styles.author)}>
        {author.id ? (
          <span>
            <ALink
              overrideStyle={styles.link}
              href={`/user/${author.id}/overview`}
            >
              {author.firstName} {author.lastName}
            </ALink>
          </span>
        ) : (
          <span>
            {author.firstName} {author.lastName}
          </span>
        )}
        {lastElem ? ", " : <span>&nbsp;&nbsp;</span>}
      </span>
    );
  });
  const formatElems = (formats || []).map((f) => {
    return f.type === "pdf" ? (
      <Button
        className={css(styles.link)}
        customButtonStyle={styles.openPDFButton}
        onClick={() => openPaperPDFModal && openPaperPDFModal(true)}
        customLabelStyle={styles.customLabelStyle}
      >
        <FontAwesomeIcon
          icon={["fas", "arrow-down-to-line"]}
          style={{ marginRight: 4 }}
        />{" "}
        View PDF
      </Button>
    ) : (
      <ALink href={f.url}>{f.type}</ALink>
    );
  });
  const claimableAuthors = document.authors.filter((a) => !a.isClaimed);

  return (
    // @ts-ignore
    <ReactPlaceholder
      ready={document.isReady}
      showLoadingAnimation
      customPlaceholder={<DocumentHeaderPlaceholder />}
    >
      {document.isReady && (
        <div className={css(styles.documentHeader)}>
          <ReactTooltip />
          {claimableAuthors.length > 0 && (
            <AuthorClaimModal
              auth={auth}
              authors={claimableAuthors}
              isOpen={isAuthorClaimModalOpen}
              setIsOpen={(isOpen) => setIsAuthorClaimModalOpen(isOpen)}
            />
          )}
          <div className={css(styles.voteWidgetContainer)}>
            <VoteWidget
              score={voteState.voteScore}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              // @ts-ignore
              selected={voteState.userVote}
              isPaper={unifiedDocument.documentType === "paper"}
              type={unifiedDocument.documentType}
            />
          </div>

          <div className={css(styles.submissionDetailsContainer)}>
            <SubmissionDetails
              createdDate={createdDate}
              hubs={hubs}
              createdBy={createdBy}
              avatarSize={30}
            />
          </div>
          <h1 className={css(styles.title)}>{title}</h1>
          <div className={css(styles.metadata)}>
            {authorElems.length > 0 && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>Authors</div>
                <div className={css(styles.metaVal)}>
                  {authorElems}
                  {claimableAuthors.length > 0 && (
                    <span
                      className={css(styles.claimProfile)}
                      onClick={() => setIsAuthorClaimModalOpen(true)}
                    >
                      Claim profile to earn Research Coin
                      <img
                        src={"/static/icons/coin-filled.png"}
                        draggable={false}
                        className={css(styles.coinIcon)}
                        alt="RSC Coin"
                        height={20}
                      />
                    </span>
                  )}
                </div>
              </div>
            )}
            {journal && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>Journal</div>
                <div className={css(styles.metaVal)}>{journal}</div>
              </div>
            )}
            {doi && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>DOI</div>
                <div className={css(styles.metaVal)}>
                  {externalUrl ? (
                    <ALink
                      href={externalUrl}
                      overrideStyle={styles.link}
                      target="blank"
                    >
                      {doi}
                    </ALink>
                  ) : (
                    <ALink
                      href={`https://` + doi}
                      overrideStyle={styles.link}
                      target="blank"
                    >
                      {doi}
                    </ALink>
                  )}
                </div>
              </div>
            )}
            {datePublished && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>Published</div>
                <div className={css(styles.metaVal)}>{datePublished}</div>
              </div>
            )}
            {isOpenAccess && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>License</div>
                <div className={css(styles.metaVal)}>Open Access</div>
              </div>
            )}
            {formatElems.length > 0 && (
              <div className={css(styles.metadataRow, styles.formatsRow)}>
                <div className={css(styles.metaKey)}>Formats</div>
                <div className={css(styles.metaVal)}>{formatElems}</div>
              </div>
            )}
          </div>
          <div className={css(styles.actionsAndDetailsRow)}>
            <div className={css(styles.additionalDetails)}>
              <div
                className={css(
                  styles.additionalDetail,
                  styles.smallScreenVoteContainer
                )}
              >
                <VoteWidget
                  score={voteState.voteScore}
                  onUpvote={onUpvote}
                  onDownvote={onDownvote}
                  horizontalView={true}
                  // @ts-ignore
                  small={true}
                  // @ts-ignore
                  selected={voteState.userVote}
                  isPaper={unifiedDocument.documentType === "paper"}
                  type={unifiedDocument.documentType}
                  styles={[styles.smallScreenVoteWidget]}
                />
              </div>
              <ALink
                overrideStyle={[styles.comments, styles.additionalDetail]}
                href={"#comments"}
              >
                <span className={css(styles.detailIcon)}>
                  {icons.commentsSolid}
                </span>
                {discussionCount}{" "}
                <span className={css(styles.commentsText)}>
                  &nbsp;{`comments`}
                </span>
              </ALink>
              {(unifiedDocument?.reviewSummary?.count || 0) > 0 && (
                <div className={css(styles.reviews, styles.additionalDetail)}>
                  <span className={css(styles.detailIcon, styles.starIcon)}>
                    {icons.starFilled}
                  </span>
                  {unifiedDocument?.reviewSummary?.avg}
                  <span className={css(styles.reviewDetails)}>
                    &nbsp;{`based on`}&nbsp;
                    <ALink overrideStyle={[styles.comments]} href={"#comments"}>
                      {(unifiedDocument?.reviewSummary?.count || 0) > 1
                        ? `${unifiedDocument?.reviewSummary?.count} reviews`
                        : `${unifiedDocument?.reviewSummary?.count} review`}
                    </ALink>
                  </span>
                </div>
              )}
              {document.boostAmount > 0 && (
                <div
                  className={css(styles.boostAmount, styles.additionalDetail)}
                  data-tip={"Research Coin tipped"}
                >
                  <span className={css(styles.coinDetailIcon)}>
                    <img
                      src={"/static/icons/coin-filled.png"}
                      draggable={false}
                      alt="RSC Coin"
                      height={20}
                    />
                  </span>
                  <span className={css(styles.boostAmountText)}>
                    +{document.boostAmount}
                  </span>
                </div>
              )}
              {unifiedDocument.documentType && (
                <div className={css(styles.type, styles.additionalDetail)}>
                  <span className={css(styles.detailIcon)}>
                    {unifiedDocument.documentType === "paper" ? (
                      icons.paperAlt
                    ) : unifiedDocument.documentType === "hypothesis" ? (
                      <HypothesisIcon onClick={() => null} />
                    ) : unifiedDocument.documentType === "post" ? (
                      icons.penSquare
                    ) : null}
                  </span>
                  <span className={css(styles.typeText)}>
                    {unifiedDocument.documentType}
                  </span>
                </div>
              )}
            </div>
            <div className={css(styles.actions)}>
              <DocumentActions
                unifiedDocument={unifiedDocument}
                type={unifiedDocument.documentType}
                onDocumentRemove={onDocumentRemove}
                onDocumentRestore={onDocumentRestore}
                handleEdit={handleEdit}
                openPaperPDFModal={
                  (formats || []).length > 0 ? openPaperPDFModal : undefined
                }
              />
            </div>
          </div>
        </div>
      )}
    </ReactPlaceholder>
  );
}

const styles = StyleSheet.create({
  boostAmount: {
    display: "flex",
    alignItems: "center",
  },
  submissionDetailsContainer: {
    marginBottom: 10,
  },
  boostAmountText: {
    color: colors.GREEN(),
    marginLeft: 7,
  },
  documentHeader: {
    position: "relative",
  },
  voteWidgetContainer: {
    position: "absolute",
    left: -50,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
  },
  openPDFButton: {
    height: "unset",
    padding: "5px 16px",
  },
  smallScreenVoteWidget: {
    marginRight: 0,
  },
  smallScreenVoteContainer: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "block",
    },
  },
  actionsAndDetailsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 25,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "block",
      marginTop: 35,
    },
  },
  additionalDetails: {
    display: "flex",
    fontSize: 16,
    alignItems: "center",
  },
  additionalDetail: {
    marginRight: 20,
    fontWeight: 400,
    color: colors.MEDIUM_GREY(),
  },
  coinDetailIcon: {
    marginTop: 3,
  },
  detailIcon: {
    marginRight: 7,
  },
  customLabelStyle: {
    fontSize: 12,
    fontWeight: 500,
  },
  starIcon: {
    color: colors.YELLOW(),
  },
  comments: {
    display: "flex",
    fontWeight: 400,
    color: colors.MEDIUM_GREY(),
  },
  reviews: {
    display: "flex",
  },
  reviewDetails: {
    display: "inline-flex",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  commentsText: {
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  type: {
    display: "flex",
  },
  typeText: {
    textTransform: "capitalize",
  },
  actions: {
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginTop: 20,
    },
  },
  claimProfile: {
    cursor: "pointer",
    color: colors.MEDIUM_GREY(),
    fontWeight: 400,
    marginLeft: 0,
    display: "inline-flex",
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  coinIcon: {
    marginLeft: 5,
    alignSelf: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  badgeIcon: {
    color: colors.NEW_BLUE(),
    fontSize: 16,
  },
  link: {
    cursor: "pointer",
    fontWeight: 400,
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  title: {
    marginTop: 10,
  },
  metadata: {
    marginTop: 25,
  },
  metadataRow: {
    display: "flex",
    lineHeight: "26px",
    marginTop: 3,
  },
  formatsRow: {
    alignItems: "center",
  },
  metaKey: {
    color: colors.MEDIUM_GREY(),
    fontWeight: 500,
    fontSize: 16,
    width: 85,
    minWidth: 85,
  },
  metaVal: {
    fontSize: 16,
  },
  author: {
    marginRight: 2,
    ":last-child": {
      marginRight: 20,
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  currentUser: state.auth?.user,
});

export default connect(mapStateToProps)(DocumentHeader);
