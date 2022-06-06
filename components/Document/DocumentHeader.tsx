import { StyleSheet, css } from "aphrodite";
import {
  parseAuthorProfile,
  TopLevelDocument,
} from "~/config/types/root_types";
import { ReactElement, useEffect, useState } from "react";
import AuthorAvatar from "../AuthorAvatar";
import ALink from "../ALink";
import HubDropDown from "../Hubs/HubDropDown";
import colors from "~/config/themes/colors";
import { timeSince } from "~/config/utils/dates";
import icons, { HypothesisIcon } from "~/config/themes/icons";
import ReactTooltip from "react-tooltip";
import DocumentActions from "./DocumentActions";
import VoteWidget from "../VoteWidget";
import { createVoteHandler } from "../Vote/utils/createVoteHandler";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { toTitleCase } from "~/config/utils/string";
import AuthorClaimModal from "~/components/AuthorClaimModal/AuthorClaimModal";
import { connect } from "react-redux";
import { breakpoints } from "~/config/themes/screen";
import DocumentHeaderPlaceholder from "../Placeholders/DocumentHeaderPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";

type Args = {
  document: TopLevelDocument,
  onDocumentRemove: Function,
  onDocumentRestore: Function,
  handleEdit: Function,
  auth: any,
  openPaperPDFModal?: Function,
};

function DocumentHeader({
  document,
  onDocumentRemove,
  onDocumentRestore,
  handleEdit,
  auth,
  openPaperPDFModal,
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
  } = document;
  
  const [isHubsDropdownOpen, setIsHubsDropdownOpen] = useState(false);
  const [isAuthorClaimModalOpen, setIsAuthorClaimModalOpen] = useState(false);
  const [voteState, setVoteState] = useState({
    userVote: userVote,
    voteScore: score,
    prevVoteScore: score,
  });

  // const showHubsDropdown = process.browser && (window.innerWidth <= breakpoints.small.int && hubs.length > 1);
  const visibleHubs = hubs.slice(0,3);
  const hiddenHubs = hubs.slice(3);

  useEffect(() => {
    setVoteState({ ...voteState, userVote });
  }, [userVote]);

  const handleVoteSuccess = ({ voteType, increment }) => {
    let newVoteScore = voteState.voteScore;
    const prevUserScore = voteState.voteScore;
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
      prevVoteScore: score,
    });
  };

  const currentUser = getCurrentUser() ?? {};
  const currentAuthor = parseAuthorProfile(currentUser.author_profile);

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
        {author.isClaimed ? (
          <span data-tip={"Verified profile"}>
            <ALink overrideStyle={styles.link} href={`/user/${author.id}/overview`}>
              {author.firstName} {author.lastName}{" "}
              <span className={css(styles.badgeIcon)}>
                {icons.checkCircleSolid}
              </span>
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
    return (
      f.type === "pdf" ? (
        <span className={css(styles.link)} onClick={() => openPaperPDFModal && openPaperPDFModal(true)}>PDF</span>
      ) : (
        <ALink href={f.url}>{f.type}</ALink>
      )
    )
  });
  const claimableAuthors = document.authors.filter(a => !a.isClaimed);

  return (
    // @ts-ignore
    <ReactPlaceholder
      ready={document.isReady}
      showLoadingAnimation
      customPlaceholder={<DocumentHeaderPlaceholder />}
    >
      {document.isReady &&
        <div className={css(styles.documentHeader)}>
          <ReactTooltip />
          {claimableAuthors.length > 0 &&
            <AuthorClaimModal
              auth={auth}
              authors={claimableAuthors}
              isOpen={isAuthorClaimModalOpen}
              setIsOpen={(isOpen) =>
                setIsAuthorClaimModalOpen(isOpen)
              }
            />
          }
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

          <div className={css(styles.submittedBy)}>
            {createdBy?.authorProfile &&
              <div className={css(styles.createdByContainer)}>
                <AuthorAvatar author={createdBy?.authorProfile} size={30} trueSize />
              </div>
            }
            <div className={css(styles.submittedByDetails)}>
              <ALink href={`/user/${createdBy?.authorProfile?.id}/overview`} overrideStyle={styles.link}>
                {createdBy?.authorProfile?.firstName}{" "}
                {createdBy?.authorProfile?.lastName}
              </ALink>
              <div className={css(styles.hubsContainer)}>
                {visibleHubs?.length > 0 && (
                  <>
                    <span
                      className={css(styles.textSecondary, styles.postedText)}
                    >{` posted in`}</span>
                    {visibleHubs.map((h, index) => (
                      <>
                        <ALink
                          theme="blankAndBlue"
                          href={`/hubs/${h.slug}`}
                          overrideStyle={styles.hubLink}
                        >
                          {toTitleCase(h.name)}
                        </ALink>
                        {index < visibleHubs?.length - 1 ? ", " : ""}
                      </>
                    ))}
                    &nbsp;
                    {hiddenHubs.length > 0 && (
                      <HubDropDown
                        hubs={hiddenHubs}
                        labelStyle={styles.hubLink}
                        containerStyle={styles.hubDropdownContainer}
                        isOpen={isHubsDropdownOpen}
                        setIsOpen={() => setIsHubsDropdownOpen(!isHubsDropdownOpen)}
                      />
                    )}
                  </>
                )}
              </div>
              <span className={css(styles.dot)}> • </span>
              <span className={css(styles.textSecondary, styles.timestamp)}>
                {timeSince(createdDate)}
              </span>
            </div>
          </div>
          <div className={css(styles.title)}>{title}</div>
          <div className={css(styles.metadata)}>
            {journal && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>Journal</div>
                <div className={css(styles.metaVal)}>{journal}</div>
              </div>
            )}
            {authorElems.length > 0 && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>Authors</div>
                <div className={css(styles.metaVal)}>
                  {authorElems}
                  {claimableAuthors.length > 0 &&
                    <span className={css(styles.claimProfile)} onClick={() => setIsAuthorClaimModalOpen(true)}>
                      Claim profile to earn Research Coin
                      <img
                        src={"/static/icons/coin-filled.png"}
                        draggable={false}
                        className={css(styles.coinIcon)}
                        alt="RSC Coin"
                        height={20}
                      />
                    </span>
                  }
                </div>
              </div>
            )}
            {doi && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>DOI</div>
                <div className={css(styles.metaVal)}>
                  {externalUrl ? (
                    <ALink href={externalUrl} overrideStyle={styles.link} target="blank">{doi}</ALink>
                  ) : (
                    {doi}
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
            {formatElems.length > 0 && (
              <div className={css(styles.metadataRow)}>
                <div className={css(styles.metaKey)}>Formats</div>
                <div className={css(styles.metaVal)}>
                  {formatElems}
                </div>
              </div>
            )}
          </div>
          <div className={css(styles.actionsAndDetailsRow)}>
            <div className={css(styles.additionalDetails)}>
              <div className={css(styles.additionalDetail, styles.smallScreenVoteContainer)}>
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
              <ALink overrideStyle={[styles.comments, styles.additionalDetail]} href={"#comments"}>
                <span className={css(styles.detailIcon)}>{icons.commentsSolid}</span>
                {discussionCount} <span className={css(styles.commentsText)}>&nbsp;{`comments`}</span>
              </ALink>
              {(unifiedDocument?.reviewSummary?.count || 0) > 0 && (
                <div className={css(styles.reviews, styles.additionalDetail)}>
                  <span className={css(styles.detailIcon, styles.starIcon)}>{icons.starFilled}</span>
                  {unifiedDocument?.reviewSummary?.avg}
                  <span className={css(styles.reviewDetails)}>
                    &nbsp;{`based on`}&nbsp;
                    <ALink overrideStyle={[styles.comments]} href={"#comments"}>
                      {(unifiedDocument?.reviewSummary?.count || 0) > 1 ? `${unifiedDocument?.reviewSummary?.count} reviews` : `${unifiedDocument?.reviewSummary?.count} review`}
                    </ALink>
                  </span>
                </div>
              )}
              {document.boostAmount > 0 && (
                <div className={css(styles.boostAmount, styles.additionalDetail)} data-tip={"Research Coin tipped"}>
                  <span className={css(styles.coinDetailIcon)}>
                    <img
                      src={"/static/icons/coin-filled.png"}
                      draggable={false}
                      // className={css(styles.coinIcon)}
                      alt="RSC Coin"
                      height={20}
                    />
                  </span>
                  <span className={css(styles.boostAmountText)}>+{document.boostAmount}</span>
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
                  <span className={css(styles.typeText)}>{unifiedDocument.documentType}</span>
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
              />
            </div>
          </div>
        </div>
      }
    </ReactPlaceholder>
  );
}

const styles = StyleSheet.create({
  boostAmount: {
    display: "flex",
    alignItems: "center",
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
      display: "none"
    }    
  },
  smallScreenVoteWidget: {
    marginRight: 0,
  },
  smallScreenVoteContainer: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "block"
    }
  },
  actionsAndDetailsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 25,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "block",
      marginTop: 35,
    }    
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
  starIcon: {
    color: colors.YELLOW(),
  },
  comments: {
    display: "flex",
    fontWeight: 400,
    color: colors.MEDIUM_GREY(),    
  },
  dot: {
    color: colors.MEDIUM_GREY(),
  },
  reviews: {
    display: "flex",
  },
  reviewDetails: {
    display: "inline-flex",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    }
  },
  commentsText: {
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    }
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
    }
  },
  submittedBy: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "21px",
    marginBottom: 10,
  },
  submittedByDetails: {
    display: "block",
  },
  postedText: {
  },
  createdByContainer: {
    marginRight: 7,
  },
  hubsContainer: {
    display: "inline",
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
    }    
  },
  timestamp: {
    marginLeft: 2,
  },
  textSecondary: {
    color: colors.MEDIUM_GREY(),
  },
  badgeIcon: {
    color: colors.NEW_BLUE(),
    fontSize: 16,
  },
  hubDropdownContainer: {
    display: "inline-block",
  },
  hubLink: {
    textTransform: "capitalize",
    marginLeft: 5,
    fontWeight: 400,
  },
  link: {
    cursor: "pointer",
    fontWeight: 400,
    ":hover": {
      color: colors.NEW_BLUE(),
    }    
  },  
  title: {
    fontSize: 32,
    fontWeight: 600,
    lineHeight: "40px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 24,
      lineHeight: "30px",
    }
  },
  metadata: {
    marginTop: 25,
  },
  metadataRow: {
    display: "flex",
    lineHeight: "26px",
    marginTop: 3,
    // [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
    //   lineHeight: "22px",
    // }
  },
  metaKey: {
    color: colors.MEDIUM_GREY(),
    fontWeight: 500,
    fontSize: 16,
    width: 85,
    minWidth: 85,
    // [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
    //   fontSize: 14,
    // }
  },
  metaVal: {
    fontSize: 16,
    // [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
    //   fontSize: 14,
    // }
  },
  author: {
    marginRight: 2,
    ":last-child": {
      marginRight: 20,
    }
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DocumentHeader);