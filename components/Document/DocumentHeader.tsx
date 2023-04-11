import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { faComments } from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { connect, useDispatch } from "react-redux";
import { createVoteHandler } from "../Vote/utils/createVoteHandler";
import { nullthrows } from "~/config/utils/nullchecks";
import {
  parseAuthorProfile,
  TopLevelDocument,
} from "~/config/types/root_types";
import { ReactElement, useEffect, useState } from "react";
import { UPVOTE, DOWNVOTE, NEUTRALVOTE } from "~/config/constants";
import ALink from "../ALink";
import AuthorClaimModal from "~/components/AuthorClaimModal/AuthorClaimModal";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import DocumentActions from "./DocumentActions";
import DocumentHeaderPlaceholder from "../Placeholders/DocumentHeaderPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import ReactTooltip from "react-tooltip";
import SubmissionDetails from "./SubmissionDetails";
import VoteWidget from "../VoteWidget";
import BountyAlert from "../Bounty/BountyAlert";
import { unescapeHtmlString } from "~/config/utils/unescapeHtmlString";
import ContentBadge from "../ContentBadge";
import { useRouter } from "next/router";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { formatBountyAmount } from "~/config/types/bounty";

type Args = {
  document: TopLevelDocument;
  onDocumentRemove: Function;
  onDocumentRestore: Function;
  handleEdit: Function;
  auth: any;
  openPaperPDFModal?: Function;
  currentUser?: any;
  hasBounties?: boolean;
  bounty: any;
  bounties: any;
  allBounties: any;
  bountyType: string;
  isOriginalPoster?: boolean;
  onBountyAdd?: any; // TODO: add function type here
  onBountyRemove?: Function;
  post?: any; // TODO: add post type
  bountyText?: string;
  threads: any;
  setHasBounties: (boolean) => void;
};

function DocumentHeader({
  document,
  onDocumentRemove,
  onDocumentRestore,
  handleEdit,
  auth,
  openPaperPDFModal,
  currentUser,
  hasBounties,
  allBounties,
  setHasBounties,
  bountyType,
  onBountyAdd,
  isOriginalPoster,
  post,
  bountyText,
  onBountyRemove,
  threads,
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

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setVoteState({
      ...voteState,
      userVote: document?.userVote,
      voteScore: document.score,
    });
  }, [document]);

  const handleVoteSuccess = ({ increment, voteType }) => {
    let score = voteState.voteScore;
    if (voteType === NEUTRALVOTE) {
      if (voteState.userVote === UPVOTE) {
        score -= 1;
      } else if (voteState.userVote === DOWNVOTE) {
        score += 1;
      }

      setVoteState({
        userVote: voteType,
        voteScore: score,
      });
    } else {
      setVoteState({
        userVote: voteType,
        voteScore: voteState.voteScore + increment,
      });
    }
  };

  let onUpvote, onDownvote, onNeutralVote;
  if (document.isReady) {
    onUpvote = createVoteHandler({
      dispatch,
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
      dispatch,
      currentAuthor,
      currentVote: voteState?.userVote,
      documentCreatedBy: nullthrows(createdBy),
      documentID,
      documentType: documentType,
      onError: () => null,
      onSuccess: handleVoteSuccess,
      voteType: DOWNVOTE,
    });

    onNeutralVote = createVoteHandler({
      dispatch,
      currentAuthor: currentUser?.author_profile,
      currentVote: voteState?.userVote,
      documentCreatedBy: nullthrows(createdBy),
      documentID,
      documentType,
      onError: () => null,
      onSuccess: handleVoteSuccess,
      voteType: NEUTRALVOTE,
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
  const showClaimableAuthors =
    claimableAuthors.length > 0 && router?.pathname?.includes("/paper");
  let bountyAmount = 0;
  allBounties?.forEach((bounty) => {
    bountyAmount += bounty.amount;
  });

  const boostAmount = formatBountyAmount({ amount: document.boostAmount });

  return (
    // @ts-ignore
    <ReactPlaceholder
      ready={document.isReady}
      showLoadingAnimation
      customPlaceholder={<DocumentHeaderPlaceholder />}
    >
      {document.isReady && (
        <div className={css(styles.documentHeader)}>
          {hasBounties ? (
            <div className={css(styles.bountyAlertContainer)}>
              {/*@ts-ignore*/}
              <BountyAlert
                allBounties={allBounties}
                bountyType={bountyType}
                currentUser={currentUser}
                bountyText={bountyText}
                onBountyAdd={onBountyAdd}
                setHasBounties={setHasBounties}
                post={post}
                threads={threads}
                isOriginalPoster={isOriginalPoster}
                onBountyRemove={onBountyRemove}
                unifiedDocument={unifiedDocument}
                documentType={documentType}
              />
            </div>
          ) : null}
          <ReactTooltip />
          {showClaimableAuthors && (
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
              onNeutralVote={onNeutralVote}
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
          <h1 className={css(styles.title)}>
            {unescapeHtmlString(title ?? "")}
          </h1>
          <div className={css(styles.metadata)}>
            {documentType !== "question" && authors.length > 0 && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>Authors</div>
                <div className={css(styles.metaVal)}>
                  {authorElems}
                  {showClaimableAuthors && (
                    <span
                      className={css(styles.claimProfile)}
                      onClick={() => setIsAuthorClaimModalOpen(true)}
                    >
                      Claim your profile to earn ResearchCoin
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
              {documentType === "bounty" && bountyAmount === 0 ? null : (
                <div className={css(styles.type, styles.additionalDetail)}>
                  <ContentBadge
                    contentType={documentType}
                    label={documentType === "bounty" && bountyAmount + " RSC"}
                  />
                </div>
              )}
              {documentType !== "post" &&
                <ALink
                  overrideStyle={[styles.comments, styles.additionalDetail]}
                  href={"#comments"}
                >
                  <span className={css(styles.detailIcon)}>
                    {<FontAwesomeIcon icon={faComments}></FontAwesomeIcon>}
                  </span>
                  {discussionCount}{" "}
                  <span className={css(styles.commentsText)}>
                    &nbsp;{`comments`}
                  </span>
                </ALink>
              }
              {(unifiedDocument?.reviewSummary?.count || 0) > 0 && (
                <div className={css(styles.reviews, styles.additionalDetail)}>
                  <span className={css(styles.detailIcon, styles.starIcon)}>
                    {<FontAwesomeIcon icon={faStar}></FontAwesomeIcon>}
                  </span>
                  {unifiedDocument?.reviewSummary?.avg}
                  <span className={css(styles.reviewDetails)}>
                    {/* &nbsp;{`based on`}&nbsp;
                    <ALink overrideStyle={[styles.comments]} href={"#comments"}>
                      {(unifiedDocument?.reviewSummary?.count || 0) > 1
                        ? `${unifiedDocument?.reviewSummary?.count} reviews`
                        : `${unifiedDocument?.reviewSummary?.count} review`}
                    </ALink> */}
                  </span>
                </div>
              )}
              {document.boostAmount > 0 && (
                <div
                  className={css(styles.boostAmount, styles.additionalDetail)}
                  data-tip="ResearchCoin tipped by community members"
                >
                  <span className={css(styles.coinDetailIcon)}>
                    <ResearchCoinIcon
                      height={20}
                      width={20}
                      version={4}
                      color={"rgb(119 220 130)"}
                    />
                  </span>
                  <span className={css(styles.boostAmountText)}>
                    +{boostAmount} tipped
                  </span>
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
    marginBottom: 30,
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
    marginTop: 4,
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
    marginLeft: 8,
    // fontSize: 14,
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
