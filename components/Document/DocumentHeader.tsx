import { StyleSheet, css } from "aphrodite";
import { CreatedBy, AuthorProfile, UnifiedDocument, parseAuthorProfile } from "~/config/types/root_types";
import { Hub } from "~/config/types/hub";
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

// import DocumentActions from "./DocumentActions";

type Args = {
  title: string,
  createdBy: CreatedBy,
  authors?: Array<AuthorProfile>,
  unifiedDocument: UnifiedDocument,
  doi?: string,
  datePublished?: string,
  journal?: string,
  hubs?: Array<Hub>,
  createdDate: string,
  externalUrl: string,
  commentCount: number,
  initialVoteScore: number,
  currentUserVote: string,
  type: "paper" | "hypothesis" | "post",
}

export default function DocumentHeader({
  title,
  createdBy,
  createdDate,
  authors,
  unifiedDocument,
  externalUrl,
  doi,
  datePublished,
  journal,
  commentCount,
  hubs = [],
  type,
  currentUserVote,
  initialVoteScore = 0,
}:Args): ReactElement<"div"> {
  const [isHubsDropdownOpen, setIsHubsDropdownOpen] = useState(false);
  const [voteState, setVoteState] = useState({
    currentUserVote: currentUserVote,
    voteScore: initialVoteScore,
    prevVoteScore: initialVoteScore,
  });

  useEffect(() => {
    setVoteState({ ...voteState, currentUserVote })
  }, [currentUserVote]);

  const handleVoteSuccess = ({ voteType, increment }) => {
    let newVoteScore = voteState.voteScore;
    const prevUserScore = voteState.voteScore;
    if (voteType === UPVOTE) {
      if (voteState.currentUserVote === DOWNVOTE) {
        newVoteScore = voteState.voteScore + increment + 1;
      }
      else if (voteState.currentUserVote === UPVOTE) {
        // This shouldn't happen but if it does, we do nothing
        console.log('User already casted upvote')
        return;
      }
      else {
        newVoteScore = voteState.voteScore + increment;
      }
    } else if (voteType === DOWNVOTE) {
      if (voteState.currentUserVote === DOWNVOTE) {
        console.log('User already casted downvote')
        return;
      }
      else if (voteState.currentUserVote === UPVOTE) {
        newVoteScore = voteState.voteScore + increment - 1;
      }
      else {
        newVoteScore = voteState.voteScore + increment;
      }
    }

    setVoteState({
      currentUserVote: voteType,
      voteScore: newVoteScore,
      prevVoteScore: initialVoteScore,
    })
  }
  
  const currentUser = getCurrentUser() ?? {};
  const currentAuthor = parseAuthorProfile(currentUser.author_profile);
  const onUpvote = createVoteHandler({
    voteType: UPVOTE,
    unifiedDocument,
    currentAuthor,
    onSuccess: handleVoteSuccess,
    onError: () => null,
  });
  const onDownvote = createVoteHandler({
    voteType: DOWNVOTE,
    unifiedDocument,
    currentAuthor,
    onSuccess: handleVoteSuccess,
    onError: () => null,
  });


  const authorElems = (authors || []).map((author) => {
    return (
      <span className={css(styles.author)}>
        {author.isClaimed
          ? (
              <span data-tip={"Profile claimed by author"}>
              <ALink href={`/user/${author.id}/overview`}>
                {author.firstName} {author.lastName} <span className={css(styles.badgeIcon)}>{icons.checkCircleSolid}</span>
              </ALink>
              </span>
            )
          : (
              <span>{author.firstName} {author.lastName}</span>
            )
        }
      </span>
    )
  });

  return (
    <div className={css(styles.documentHeader)}>
      <ReactTooltip />
      <div className={css(styles.voteWidgetContainer)}>
        <VoteWidget
          score={voteState.voteScore}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          // @ts-ignore
          selected={voteState.currentUserVote}
          isPaper={unifiedDocument.documentType === "paper"}
          type={unifiedDocument.documentType}
        />
      </div>      
      <div className={css(styles.submittedBy)}>
        <AuthorAvatar author={createdBy} size={25} />
        <ALink href={`/user/${createdBy.authorProfile.id}/overview`}>{createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}</ALink>
        <div>
          {hubs?.length > 0 &&
            <>
              <span>{` posted in `}</span>
              {hubs?.slice(0, 2).map((h, index) => (
                <>
                  <ALink theme="solidPrimary" href={`/hubs/${h.slug}`} overrideStyle={styles.hubLink}>{h.name}</ALink>
                  {index < hubs?.slice(0, 2).length - 1 ? ", " : ""}
                </>
              ))}
              &nbsp;
              {hubs?.slice(2).length > 0 && (
                <HubDropDown
                  hubs={hubs?.slice(1)}
                  labelStyle={styles.hubLink}
                  containerStyle={styles.hubDropdownContainer}
                  isOpen={isHubsDropdownOpen}
                  setIsOpen={() => setIsHubsDropdownOpen(!isHubsDropdownOpen)}
                />
              )}
            </>
            }          
        </div>
        <span className={css(styles.timestamp)}>{timeSince(createdDate)}</span>
      </div>
      <div className={css(styles.title)}>{title}</div>
      <div className={css(styles.metadata)}>
        {journal &&
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>Journal</div>
            <div className={css(styles.metaVal)}>{journal}</div>
          </div>
        }
        {authorElems.length > 0 &&
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>Authors</div>
            <div className={css(styles.metaVal)}>{authorElems}</div>
            <div className={css(styles.claimProfile)}>
              Claim profile to earn Research Coin
              <img
                src={"/static/icons/coin-filled.png"}
                draggable={false}
                className={css(styles.coinIcon)}
                alt="RSC Coin"
                height={18}
              />              
            </div>
          </div>
        }
        {doi &&
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>DOI</div>
            <div className={css(styles.metaVal)}>{doi}</div>
          </div>
        }
        {datePublished &&
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>Published</div>
            <div className={css(styles.metaVal)}>{datePublished}</div>
          </div>
        }
      </div>
      <div className={css(styles.actionsAndDetailsRow)}>
        <div className={css(styles.additionalDetails)}>
          <div className={css(styles.comments)}>
            {icons.commentsSolid}
            {commentCount} {`comments`}
          </div>
          {(unifiedDocument?.reviewSummary?.count || 0) > 0 &&
            <div className={css(styles.reviews)}>
              {icons.starAlt}
              {unifiedDocument?.reviewSummary?.avg} {`based on `} {unifiedDocument?.reviewSummary?.count} {`reviews`}
            </div>
          }
          <div className={css(styles.type)}>
            {type === "paper"
              ? icons.paperAlt
              : type === "hypothesis"
              ? <HypothesisIcon onClick={() => null} />
              : type === "post"
              ? icons.post
              : null
            }
            <span className={css(styles.typeText)}>{type}</span>
          </div>
        </div>
        <div className={css(styles.actions)}>
          <DocumentActions
            unifiedDocument={unifiedDocument}
            type={type}
          />
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  documentHeader: {
    position: "relative",
  },
  voteWidgetContainer: {
    position: "absolute",
    left: -50,
  },
  actionsAndDetailsRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  additionalDetails: {

  },
  comments: {

  },
  reviews: {

  },
  type: {

  },
  typeText: {
    textTransform: "capitalize",
  },
  actions: {

  },
  submittedBy: {
    display: "flex",
  },
  claimProfile: {

  },
  coinIcon: {

  },
  timestamp: {
    color: colors.BLACK(0.5),
  },
  badgeIcon: {
    color: colors.NEW_BLUE(),
    fontSize: 14,
  },
  hubDropdownContainer: {
    display: "inline-block",
  },
  hubLink: {
    color: colors.BLACK(),
    textTransform: "capitalize",
    fontSize: 14,
    ":hover": {
      color: colors.BLACK(),
      textDecoration: "underline",
    },
  },
  title: {
    fontSize: 32,
    fontWeight: 500,
    lineHeight: "40px",
  },
  metadata: {

  },
  metadataRow: {

  },
  metaKey: {

  },
  metaVal: {

  },
  author: {

  }
});
