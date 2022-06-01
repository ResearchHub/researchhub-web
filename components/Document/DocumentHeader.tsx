import { StyleSheet, css } from "aphrodite";
import {
  parseAuthorProfile,
  TopLevelDocument,
} from "~/config/types/root_types";
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
import { toTitleCase } from "~/config/utils/string";

type Args = {
  document: TopLevelDocument
};

export default function DocumentHeader({
  document
}: Args): ReactElement<"div"> {

  const {
    title,
    createdBy,
    createdDate,
    authors,
    unifiedDocument,
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
  const [voteState, setVoteState] = useState({
    userVote: userVote,
    voteScore: score,
    prevVoteScore: score,
  });

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
        {author.isClaimed ? (
          <span data-tip={"Profile claimed by author"}>
            <ALink href={`/user/${author.id}/overview`}>
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
      </span>
    );
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
          selected={voteState.userVote}
          isPaper={unifiedDocument.documentType === "paper"}
          type={unifiedDocument.documentType}
        />
      </div>
      <div className={css(styles.submittedBy)}>
        <div className={css(styles.avatarContainer)}>
          <AuthorAvatar author={createdBy} size={25} />
        </div>
        <ALink href={`/user/${createdBy?.authorProfile?.id}/overview`}>
          {createdBy?.authorProfile?.firstName}{" "}
          {createdBy?.authorProfile?.lastName}
        </ALink>
        <div className={css(styles.hubsContainer)}>
          {hubs?.length > 0 && (
            <>
              <span
                className={css(styles.textSecondary, styles.postedText)}
              >{`posted`}</span>
              {hubs?.slice(0, 2).map((h, index) => (
                <>
                  <span className={css(styles.textSecondary)}>{` in`}</span>
                  <ALink
                    theme="solidPrimary"
                    href={`/hubs/${h.slug}`}
                    overrideStyle={styles.hubLink}
                  >
                    {toTitleCase(h.name)}
                  </ALink>
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
          )}
        </div>
        <span className={css(styles.textSecondary, styles.timestamp)}>
          {timeSince(createdDate)}
        </span>
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
        )}
        {doi && (
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>DOI</div>
            <div className={css(styles.metaVal)}>{doi}</div>
          </div>
        )}
        {datePublished && (
          <div className={css(styles.metadataRow)}>
            <div className={css(styles.metaKey)}>Published</div>
            <div className={css(styles.metaVal)}>{datePublished}</div>
          </div>
        )}
      </div>
      <div className={css(styles.actionsAndDetailsRow)}>
        <div className={css(styles.additionalDetails)}>
          <div className={css(styles.comments)}>
            {icons.commentsSolid}
            {discussionCount} {`comments`}
          </div>
          {(unifiedDocument?.reviewSummary?.count || 0) > 0 && (
            <div className={css(styles.reviews)}>
              {icons.starAlt}
              {unifiedDocument?.reviewSummary?.avg} {`based on `}{" "}
              {unifiedDocument?.reviewSummary?.count} {`reviews`}
            </div>
          )}
          <div className={css(styles.type)}>
            {unifiedDocument.documentType === "paper" ? (
              icons.paperAlt
            ) : unifiedDocument.documentType === "hypothesis" ? (
              <HypothesisIcon onClick={() => null} />
            ) : unifiedDocument.documentType === "post" ? (
              icons.post
            ) : null}
            <span className={css(styles.typeText)}>{unifiedDocument.documentType}</span>
          </div>
        </div>
        <div className={css(styles.actions)}>
          <DocumentActions unifiedDocument={unifiedDocument} type={unifiedDocument.documentType} />
        </div>
      </div>
    </div>
  );
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
  additionalDetails: {},
  comments: {},
  reviews: {},
  type: {},
  typeText: {
    textTransform: "capitalize",
  },
  actions: {},
  submittedBy: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "26px",
  },
  postedText: {
    marginLeft: 5,
    // marginRight: 5,
  },
  avatarContainer: {
    marginRight: 7,
  },
  hubsContainer: {},
  claimProfile: {},
  coinIcon: {},
  timestamp: {
    marginLeft: 2,
  },
  textSecondary: {
    color: colors.BLACK(0.7),
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
    marginLeft: 5,
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
  metadata: {},
  metadataRow: {},
  metaKey: {},
  metaVal: {},
  author: {},
});
