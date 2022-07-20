import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { createVoteHandler } from "../Vote/utils/createVoteHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nullthrows } from "~/config/utils/nullchecks";
import {
  parseAuthorProfile,
  TopLevelDocument,
  VoteType,
} from "~/config/types/root_types";
import { ReactElement, useEffect, useState } from "react";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import ALink from "../ALink";
import AuthorClaimModal from "~/components/AuthorClaimModal/AuthorClaimModal";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import DocumentActions from "./DocumentActions";
import DocumentHeaderPlaceholder from "../Placeholders/DocumentHeaderPlaceholder";
import icons, { HypothesisIcon } from "~/config/themes/icons";
import ReactPlaceholder from "react-placeholder/lib";
import ReactTooltip from "react-tooltip";
import SubmissionDetails from "./SubmissionDetails";
import VoteWidget from "../VoteWidget";
import BountyAlert from "../Bounty/BountyAlert";


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
    id: documentID,
  } = document;
  const { documentType } = unifiedDocument ?? {};
  const currentAuthor = parseAuthorProfile(currentUser.author_profile);
  const [isAuthorClaimModalOpen, setIsAuthorClaimModalOpen] = useState(false);
  const [showSecondaryAuthors, setShowSecondaryAuthors] = useState(false);
  const [voteState, setVoteState] = useState<{
    userVote: VoteType | null | undefined;
    voteScore: number;
  }>({
    userVote: userVote,
    voteScore: score,
  });

  useEffect(() => {
    setVoteState({
      ...voteState,
      userVote: document?.userVote,
      voteScore: document.score,
    });
  }, [document]);

  const handleVoteSuccess = ({ increment, voteType }) => {
    setVoteState({
      userVote: voteType,
      voteScore: voteState.voteScore + increment,
    });
  };

  let onUpvote, onDownvote;
  if (document.isReady) {
    onUpvote = createVoteHandler({
      currentAuthor,
      currentVote: voteState?.userVote,
      documentCreatedBy: nullthrows(createdBy),
      documentID,
      documentType: documentType,
      onError: () => null,
      onSuccess: handleVoteSuccess,
      voteType: UPVOTE,
    });
    onDownvote = createVoteHandler({
      currentAuthor,
      currentVote: voteState?.userVote,
      documentCreatedBy: nullthrows(createdBy),
      documentID,
      documentType: documentType,
      onError: () => null,
      onSuccess: handleVoteSuccess,
      voteType: DOWNVOTE,
    });
  }

  const buildAuthorElem = (author) => {
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
      </span>
    );
  };

  const buildAuthors = (authors) => {
    if (!Array.isArray(authors)) {
      return [];
    }

    const minLengthReqToHide = 4;

    let primaryAuthors: Array<ReactElement<"div">> = [];
    primaryAuthors = authors
      .slice(0, 2)
      .map((author) => buildAuthorElem(author));

    let secondaryAuthors: Array<ReactElement<"div">> = [];
    if (authors.length >= minLengthReqToHide) {
      secondaryAuthors = authors
        .slice(2, authors.length - 1)
        .map((author) => buildAuthorElem(author));
    }

    const primaryAuthorElems = primaryAuthors.map((author, idx) => {
      const renderComma =
        (showSecondaryAuthors && authors.length > 2) ||
        (authors.length > 1 && idx < primaryAuthors.length - 1);
      return (
        <>
          {author}
          {renderComma ? "," : ""}
        </>
      );
    });
    const secondaryAuthorElems = secondaryAuthors.map((author, idx) => (
      <>
        {author}
        {idx < secondaryAuthors.length - 1 ? "," : ""}
      </>
    ));
    const lastAuthor =
      authors.length > 2 ? buildAuthorElem(authors[authors.length - 1]) : null;

    return (
      <div className={css(styles.authorsContainer)}>
        {primaryAuthorElems}
        <div
          className={css(
            styles.secondaryAuthors,
            showSecondaryAuthors && styles.showSecondaryAuthors
          )}
        >
          {secondaryAuthorElems}
        </div>
        {!showSecondaryAuthors && secondaryAuthors.length > 0 && (
          <div
            className={css(styles.toggleHiddenAuthorsBtn)}
            onClick={() => setShowSecondaryAuthors(true)}
          >
            +{secondaryAuthors.length} authors
          </div>
        )}
        {lastAuthor && <>,{lastAuthor}</>}
        {showSecondaryAuthors && (
          <div
            className={css(styles.toggleHiddenAuthorsBtn)}
            onClick={() => setShowSecondaryAuthors(false)}
          >
            Show less
          </div>
        )}
      </div>
    );
  };

  const authorElems = documentType !== "question" && buildAuthors(authors);

  const formatElems = (formats || []).map((f) => {
    return f.type === "pdf" ? (
      <Button
        className={css(styles.link)}
        customButtonStyle={styles.openPDFButton}
        onClick={() => openPaperPDFModal && openPaperPDFModal(true)}
        customLabelStyle={styles.customLabelStyle}
      >
        <FontAwesomeIcon
          //@ts-ignore
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
  const hasBounties = document.bounties && document?.bounties?.length > 0;

  return (
    // @ts-ignore
    <ReactPlaceholder
      ready={document.isReady}
      showLoadingAnimation
      customPlaceholder={<DocumentHeaderPlaceholder />}
    >
      {document.isReady && (
        <div className={css(styles.documentHeader)}>

          {hasBounties &&
            <div className={css(styles.bountyAlertContainer)}>
              {/*@ts-ignore*/}
              <BountyAlert bounty={document.bounties[0]} />
            </div>
          }
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
              isPaper={documentType === "paper"}
              type={documentType}
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
            {documentType !== "question" && authors.length > 0 && (
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
                  isPaper={documentType === "paper"}
                  type={documentType}
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
              {documentType && (
                <div className={css(styles.type, styles.additionalDetail)}>
                  <span className={css(styles.detailIcon)}>
                    {documentType === "paper" ? (
                      icons.paperAlt
                    ) : documentType === "hypothesis" ? (
                      <HypothesisIcon onClick={() => null} />
                    ) : documentType === "post" ? (
                      icons.penSquare
                    ) : documentType === "question" ? (
                      icons.question
                    ) : null}
                  </span>
                  <span className={css(styles.typeText)}>{documentType}</span>
                </div>
              )}
            </div>
            <div className={css(styles.actions)}>
              <DocumentActions
                unifiedDocument={unifiedDocument}
                type={documentType}
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
  bountyAlertContainer: {
    marginBottom: 15,
  },
  authorsContainer: {
    display: "inline",
  },
  secondaryAuthors: {
    display: "none",
    marginLeft: 5,
  },
  showSecondaryAuthors: {
    display: "inline",
  },
  toggleHiddenAuthorsBtn: {
    marginLeft: 5,
    display: "inline",
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
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
    marginLeft: 5,
    ":first-child": {
      marginLeft: 0,
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  currentUser: state.auth?.user,
});

export default connect(mapStateToProps)(DocumentHeader);
