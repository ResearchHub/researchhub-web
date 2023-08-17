import { css, StyleSheet } from "aphrodite";
import {
  DOWNVOTE,
  DOWNVOTE_ENUM,
  UPVOTE,
  UPVOTE_ENUM,
  userVoteToConstant,
} from "~/config/constants";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import {
  Fragment,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import API from "~/config/api";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import { faDown, faUp } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import helpers from "~/config/api/helpers";

export type VoteMeta = {
  downCount: number;
  totalCount: number;
  upCount: number;
  userVote: any /* BE payload to determine what vote currUser casted */;
};

type HandleVoteArgs = {
  currentUserVoteType: string | null;
  localVoteMeta: VoteMeta;
  onUpdateSuccess?: Function;
  setLocalVoteMeta: (VoteMeta: VoteMeta) => void;
  shouldAllowVote: Boolean;
  voteAPI: string;
};

type ComponentProp = {
  downVoteAPI: string;
  onUpdateSuccess?: Function;
  shouldAllowVote: Boolean;
  upVoteAPI: string;
  voteMeta: VoteMeta;
};

function useEffectSyncLocalvoteMeta({
  voteMeta,
  voteMeta: {
    downCount: downCountProp,
    upCount: upCountProp,
    userVote: userVoteProp,
  },
  localVoteMeta: { downCount, upCount, userVote },
  setLocalVoteMeta,
}: {
  voteMeta: VoteMeta;
  localVoteMeta: VoteMeta;
  setLocalVoteMeta: Function;
}): void {
  useEffect((): void => {
    if (
      downCountProp !== downCount ||
      upCountProp !== upCount ||
      userVoteProp !== userVote
    ) {
      setLocalVoteMeta(voteMeta);
    }
  }, [downCountProp, upCountProp, userVoteProp]);
}

const handleDownvote = ({
  currentUserVoteType,
  localVoteMeta,
  onUpdateSuccess,
  setLocalVoteMeta,
  shouldAllowVote,
  voteAPI,
}: HandleVoteArgs): void => {
  if (!shouldAllowVote || currentUserVoteType === DOWNVOTE) {
    return;
  }

  const hasCurrUserVoted = !isNullOrUndefined(currentUserVoteType);
  const { downCount, totalCount, upCount, userVote } = localVoteMeta;

  const updatedMeta = {
    ...localVoteMeta,
    downCount: downCount + 1,
    upCount: currentUserVoteType === UPVOTE ? upCount - 1 : upCount,
    totalCount: hasCurrUserVoted ? totalCount : totalCount + 1,
    userVote: { ...userVote, vote_type: DOWNVOTE_ENUM },
  };

  setLocalVoteMeta(updatedMeta); /* optimistic update */
  fetch(voteAPI, API.POST_CONFIG())
    .then(helpers.checkStatus)
    .then(helpers.parseJSON)
    .then((userVote: Object): void => {
      setLocalVoteMeta({
        ...updatedMeta,
        userVote,
      });
      if (!isNullOrUndefined(onUpdateSuccess)) {
        nullthrows(onUpdateSuccess)();
      }
    })
    .catch((error: Error): void => {
      emptyFncWithMsg(error); // TODO: calvinhlee - consider adding sentry?
    });
};

const handleUpvote = ({
  currentUserVoteType,
  localVoteMeta,
  onUpdateSuccess,
  setLocalVoteMeta,
  shouldAllowVote,
  voteAPI,
}: HandleVoteArgs): void => {
  if (!shouldAllowVote || currentUserVoteType === UPVOTE) {
    return;
  }
  const hasCurrUserVoted = !isNullOrUndefined(currentUserVoteType);
  const { downCount, totalCount, upCount, userVote } = localVoteMeta;

  const updatedMeta = {
    ...localVoteMeta,
    downCount: currentUserVoteType === DOWNVOTE ? downCount - 1 : downCount,
    upCount: upCount + 1,
    totalCount: hasCurrUserVoted ? totalCount : totalCount + 1,
    userVote: { ...userVote, vote_type: UPVOTE_ENUM },
  };

  setLocalVoteMeta(updatedMeta); /* optimistic update */
  fetch(voteAPI, API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((userVote: Object): void => {
      setLocalVoteMeta({
        ...updatedMeta,
        userVote,
      });
      if (!isNullOrUndefined(onUpdateSuccess)) {
        nullthrows(onUpdateSuccess)();
      }
    })
    .catch((error: Error): void => {
      emptyFncWithMsg(error); // TODO: calvinhlee - consider adding sentry?
    });
};

export default function VoteWidgetV2({
  downVoteAPI,
  onUpdateSuccess,
  shouldAllowVote,
  upVoteAPI,
  voteMeta,
}: ComponentProp): ReactElement<typeof Fragment> {
  const [localVoteMeta, setLocalVoteMeta] = useState<VoteMeta>(voteMeta);

  useEffectSyncLocalvoteMeta({
    voteMeta,
    localVoteMeta,
    setLocalVoteMeta,
  });

  const { downCount = 0, upCount = 0, userVote } = localVoteMeta ?? {};

  const currentUserVoteType = userVoteToConstant(userVote);
  const displayedScore = upCount - downCount;

  return (
    <Fragment>
      <div
        className={
          shouldAllowVote
            ? css([
                styles.icon,
                currentUserVoteType === UPVOTE && styles.selected,
              ])
            : css(styles.iconDisabled)
        }
        onClick={(event: SyntheticEvent) => {
          event.stopPropagation();
          event.preventDefault();
          handleUpvote({
            currentUserVoteType,
            localVoteMeta,
            onUpdateSuccess,
            setLocalVoteMeta,
            shouldAllowVote,
            voteAPI: upVoteAPI,
          });
        }}
      >
        {<FontAwesomeIcon icon={faUp}></FontAwesomeIcon>}
      </div>
      <div className={css(styles.displayedScore)}>{displayedScore}</div>
      <div
        className={
          shouldAllowVote
            ? css([
                styles.icon,
                currentUserVoteType === DOWNVOTE && styles.selectedDown,
              ])
            : css(styles.iconDisabled)
        }
        onClick={(event: SyntheticEvent) => {
          event.stopPropagation();
          event.preventDefault();
          handleDownvote({
            currentUserVoteType,
            localVoteMeta,
            onUpdateSuccess,
            setLocalVoteMeta,
            shouldAllowVote,
            voteAPI: downVoteAPI,
          });
        }}
      >
        {<FontAwesomeIcon icon={faDown}></FontAwesomeIcon>}
      </div>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  displayedScore: {
    background: voteWidgetColors.BACKGROUND,
    color: colors.GREEN(),
    boxSizing: "border-box",
    fontWeight: "bold",
    borderRadius: 5,
    padding: ".2em .5em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 24,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  icon: {
    cursor: "pointer",
    padding: 6,
    color: voteWidgetColors.ARROW,
    ":hover": {
      color: colors.BLUE(1),
    },
    fontSize: 14,
  },
  iconDisabled: {
    color: voteWidgetColors.ARROW,
    cursor: "unset",
    fontSize: 14,
  },
  selected: {
    color: colors.GREEN(),
  },
  selectedDown: {
    color: colors.ORANGE(),
  },
  marginLeft: {
    marginLeft: 8,
  },
  marginRight: {
    marginRight: 8,
  },
});
