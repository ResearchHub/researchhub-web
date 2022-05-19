import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import React, {
  Fragment,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { getCurrentUserLegacy } from "~/config/utils/user";
import { ID } from "~/config/types/root_types";
import { postCitationVote } from "../../api/postCitationVote";
import {
  UPVOTE,
  DOWNVOTE,
  NEUTRALVOTE,
  userVoteToConstant,
  DOWNVOTE_ENUM,
  NEUTRALVOTE_ENUM,
  UPVOTE_ENUM,
} from "~/config/constants";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import Image from "next/image";
import ReactTooltip from "react-tooltip";

export type ConsensusMeta = {
  downCount: number;
  neutralCount: number;
  upCount: number;
  totalCount: number | null;
  userVote: any;
};

type CitationConsensusItemProps = {
  citationID: ID;
  consensusMeta: ConsensusMeta;
  currentUser?: any; // Redux
  disableText?: boolean;
  shouldAllowVote: boolean;
  updateLastFetchTime: Function;
};

type SentimentBarProps = {
  color: string;
  onClick?: ((event: SyntheticEvent) => void) | null;
  pointRight?: boolean;
  width: number | string;
};

function SentimentBar({
  color,
  onClick,
  pointRight = false,
  width,
}: SentimentBarProps): ReactElement<"div"> {
  return (
    <div
      className={css(
        styles.sentimentBar,
        pointRight ? styles.pointRightBorder : styles.pointLeftBorder,
        Boolean(onClick) ? styles.cursorPointer : null
      )}
      onClick={onClick ?? silentEmptyFnc}
      style={{ backgroundColor: color, width: `${width}%`, maxWidth: "50%" }}
    />
  );
}

function getDetailedText({
  citationID,
  disableText,
  doesMajoritySupport,
  isNeutral,
  totalCount,
  majorityPercent,
}: {
  citationID: ID;
  disableText: boolean;
  doesMajoritySupport: boolean;
  isNeutral: boolean;
  totalCount: number;
  majorityPercent: number;
}): ReactNode {
  const isPlural = !isNaN(totalCount) && totalCount > 1;
  const answer = doesMajoritySupport ? "yes" : "no";
  return (
    <div
      className={css(
        styles.resultWrap,
        Boolean(disableText ?? false) && styles.hideText
      )}
    >
      {isNeutral ? (
        <span className={css(styles.neutralImg)}>{icons.minusCircle}</span>
      ) : doesMajoritySupport ? (
        <Image width={10} height={10} src="/static/icons/check.svg" />
      ) : (
        <span className={css(styles.noSupportImg)}>{icons.timesCircle}</span>
      )}
      <div
        className={css(styles.consensusText)}
        style={{
          color: isNeutral
            ? colors.TEXT_GREY(1)
            : doesMajoritySupport
            ? colors.GREEN(1)
            : colors.RED(1),
        }}
      >
        <span
          className={css(styles.resultText)}
          data-tip
          data-for={`consensus-detailed-text-${nullthrows(citationID)}`}
        >{`${
          isNeutral
            ? "Neutral"
            : majorityPercent > 75
            ? `Most likely ${answer}`
            : `Leaning towards ${answer}`
        }`}</span>
        <ReactTooltip
          backgroundColor="#E69A8DFF"
          effect="solid"
          id={`consensus-detailed-text-${nullthrows(citationID)}`}
          place="top"
          textColor="#5F4B8BFF"
          type="dark"
        >
          {isNeutral
            ? `${totalCount} researcher${isPlural ? "s" : ""} ${
                isPlural ? "are split" : "is neutral"
              }`
            : `${Math.floor(majorityPercent)}% of researchers think ${answer}`}
        </ReactTooltip>
      </div>
    </div>
  );
}

function useEffectSyncLocalConsensusMeta({
  consensusMeta,
  consensusMeta: {
    downCount: downCountProp,
    neutralCount: neutralCountProp,
    upCount: upCountProp,
    userVote: userVoteProp,
  },
  localConsensusMeta: { downCount, neutralCount, upCount, userVote },
  setLocalConsensusMeta,
}: {
  consensusMeta: ConsensusMeta;
  localConsensusMeta: ConsensusMeta;
  setLocalConsensusMeta: Function;
}): void {
  useEffect((): void => {
    if (
      downCountProp !== downCount ||
      neutralCountProp !== neutralCount ||
      upCountProp !== upCount ||
      userVoteProp !== userVote
    ) {
      setLocalConsensusMeta(consensusMeta);
    }
  }, [downCountProp, neutralCountProp, upCountProp, userVoteProp]);
}

function CitationConsensusItem({
  citationID,
  consensusMeta,
  disableText,
  shouldAllowVote,
  updateLastFetchTime,
}: CitationConsensusItemProps): ReactElement<"div"> | null {
  const [localConsensusMeta, setLocalConsensusMeta] =
    useState<ConsensusMeta>(consensusMeta);

  const {
    downCount = 0,
    neutralCount = 0,
    upCount = 0,
    totalCount,
    userVote,
  } = localConsensusMeta ?? {};

  useEffectSyncLocalConsensusMeta({
    consensusMeta,
    localConsensusMeta,
    setLocalConsensusMeta,
  });

  const [localTotalCount, setlocalTotalCount] = useState<number>(
    totalCount ?? downCount + upCount + neutralCount
  );
  const [majority, setMajority] = useState<string>(
    upCount >= downCount ? UPVOTE : DOWNVOTE
  );

  // This is a way to avoid NaN & not return any element
  if (localTotalCount === 0 && Boolean(userVote)) {
    return null;
  }

  const currentUserVoteType = userVoteToConstant(userVote);
  const hasCurrUserVoted = !isNullOrUndefined(currentUserVoteType);

  const handleReject = (event: SyntheticEvent): void => {
    event.stopPropagation();
    if (!shouldAllowVote || currentUserVoteType === DOWNVOTE) {
      return;
    }
    const updatedMeta = {
      ...localConsensusMeta,
      downCount: downCount + 1,
      neutralCount:
        currentUserVoteType === NEUTRALVOTE ? neutralCount - 1 : neutralCount,
      upCount: currentUserVoteType === UPVOTE ? upCount - 1 : upCount,
      userVote: { ...userVote, vote_type: DOWNVOTE_ENUM },
    };
    setLocalConsensusMeta(updatedMeta);
    setlocalTotalCount(
      hasCurrUserVoted ? localTotalCount : localTotalCount + 1
    );
    setMajority(
      updatedMeta.upCount >= updatedMeta.downCount ? UPVOTE : DOWNVOTE
    );
    postCitationVote({
      citationID,
      onSuccess: (userVote: Object): void => {
        // NOTE: optimistic update.
        setLocalConsensusMeta({
          ...updatedMeta,
          userVote,
        });
        updateLastFetchTime();
      },
      onError: emptyFncWithMsg,
      voteType: DOWNVOTE,
    });
  };

  const handleNeutralVote = (event: SyntheticEvent): void => {
    event.stopPropagation();
    if (!shouldAllowVote || currentUserVoteType === NEUTRALVOTE) {
      return;
    }
    const updatedMeta = {
      ...localConsensusMeta,
      downCount: currentUserVoteType === DOWNVOTE ? downCount - 1 : downCount,
      neutralCount: neutralCount + 1,
      upCount: currentUserVoteType === UPVOTE ? upCount - 1 : upCount,
      userVote: { ...userVote, vote_type: NEUTRALVOTE_ENUM },
    };
    setLocalConsensusMeta(updatedMeta);
    setlocalTotalCount(
      hasCurrUserVoted ? localTotalCount : localTotalCount + 1
    );
    setMajority(
      updatedMeta.upCount >= updatedMeta.downCount ? UPVOTE : DOWNVOTE
    );
    postCitationVote({
      citationID,
      onSuccess: (userVote: Object): void => {
        // NOTE: optimistic update.
        setLocalConsensusMeta({
          ...updatedMeta,
          userVote,
        });
        updateLastFetchTime();
      },
      onError: emptyFncWithMsg,
      voteType: NEUTRALVOTE,
    });
  };

  const handleSupport = (event: SyntheticEvent): void => {
    event.stopPropagation();
    if (!shouldAllowVote || currentUserVoteType === UPVOTE) {
      return;
    }
    const updatedMeta = {
      ...localConsensusMeta,
      downCount: currentUserVoteType === DOWNVOTE ? downCount - 1 : downCount,
      neutralCount:
        currentUserVoteType === NEUTRALVOTE ? neutralCount - 1 : neutralCount,
      upCount: upCount + 1,
      userVote: { ...userVote, vote_type: UPVOTE_ENUM },
    };
    setLocalConsensusMeta(updatedMeta);
    setlocalTotalCount(
      hasCurrUserVoted ? localTotalCount : localTotalCount + 1
    );
    setMajority(
      updatedMeta.upCount >= updatedMeta.downCount ? UPVOTE : DOWNVOTE
    );
    postCitationVote({
      citationID,
      onSuccess: (userVote: Object): void => {
        // NOTE: optimistic update.
        setLocalConsensusMeta({
          ...updatedMeta,
          userVote,
        });
        updateLastFetchTime();
      },
      onError: emptyFncWithMsg,
      voteType: UPVOTE,
    });
  };

  const isNeutral = (upCount ?? 0) === downCount;
  const doesMajoritySupport = !isNeutral && majority === UPVOTE;
  const majorityPercent =
    ((doesMajoritySupport ? upCount : downCount) / localTotalCount) * 100;
  const weightedPercent = majorityPercent / 2; // each sentimentbar consists 50% of the full bar
  const consensusDetailText = getDetailedText({
    citationID,
    disableText: Boolean(disableText),
    doesMajoritySupport,
    isNeutral,
    majorityPercent,
    totalCount: localTotalCount,
  });

  const consensusBar =
    localTotalCount > 0 ? (
      <div className={css(styles.consensusWrap)}>
        {consensusDetailText}
        <Fragment>
          {isNeutral ? (
            <div className={css(styles.consensusInnerWrap)}>
              <SentimentBar
                color={colors.LIGHT_GREY_BORDER}
                onClick={shouldAllowVote ? handleReject : null}
                width={25}
              />
              <div
                className={css(
                  styles.sentimentMidpoint,
                  shouldAllowVote ? styles.cursorPointer : null
                )}
                onClick={handleNeutralVote}
              />
              <SentimentBar
                color={colors.LIGHT_GREY_BORDER}
                onClick={shouldAllowVote ? handleSupport : null}
                pointRight
                width={25}
              />
            </div>
          ) : (
            <div className={css(styles.consensusInnerWrap)}>
              <SentimentBar
                color={doesMajoritySupport ? "transparent" : colors.RED(1)}
                onClick={shouldAllowVote ? handleReject : null}
                width={doesMajoritySupport ? 100 : weightedPercent}
              />
              <div
                className={css(
                  styles.sentimentMidpoint,
                  shouldAllowVote ? styles.cursorPointer : null
                )}
                onClick={handleNeutralVote}
              />
              <SentimentBar
                color={doesMajoritySupport ? colors.GREEN(1) : "transparent"}
                onClick={shouldAllowVote ? handleSupport : null}
                pointRight
                width={doesMajoritySupport ? weightedPercent : 100}
              />
            </div>
          )}
        </Fragment>
      </div>
    ) : null;

  return (
    <div className={css(styles.citationConsensusItem)}>
      <div className={css(styles.wrapper)}>
        {consensusBar}
        {hasCurrUserVoted || !shouldAllowVote ? null : (
          <div
            className={css(
              styles.voteWrap,
              localTotalCount === 0 && styles.noMargin
            )}
          >
            <div
              className={css(styles.button, styles.red)}
              onClick={handleReject}
              role="button"
            >
              <div className={css(styles.iconWrap)}>{icons.timesCircle}</div>
              <div className={css(styles.buttonText)}>{"Rejects"}</div>
            </div>
            <div
              className={css(styles.button)}
              onClick={handleNeutralVote}
              role="button"
            >
              <div className={css(styles.iconWrap)}>{icons.minusCircle}</div>
              <div className={css(styles.buttonText)}>{"Neutral"}</div>
            </div>
            <div
              className={css(styles.button, styles.green)}
              onClick={handleSupport}
              role="button"
            >
              <div className={css(styles.iconWrap)}>{icons.checkCircle}</div>
              <div className={css(styles.buttonText)}>{"Supports"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  citationConsensusItem: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  voteWrap: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginTop: 16,
    width: "inherit",
    marginLeft: 3,
    "@media only screen and (min-width: 1024px)": {
      maxWidth: 166,
    },
  },
  button: {
    alignItems: "center",
    color: colors.LIGHT_GREY_TEXT,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    margin: "0 8px",
  },
  hideText: {
    display: "none",
  },
  buttonText: {
    display: "block",
    fontSize: 12,
  },
  consensusDetailedText: {
    display: "flex",
    width: "inherit",
    justifyContent: "center",
    alignItems: "center",
  },
  centerVote: {
    marginLeft: 10,
  },
  consensusBar: {},
  consensusInnerWrap: {
    alignItems: "center",
    background: colors.LIGHT_GREY_BACKGROUND,
    borderRadius: 8,
    display: "flex",
    marginTop: 8,
    marginBottom: 8,
    height: 8,
    justifyContent: "center",
    position: "relative",
    width: "100%",
  },
  consensusText: {
    maxWidth: "inherit",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  consensusWrap: {
    height: "100%",
    maxHeight: 28,
    width: "100%",
    minWidth: 116,
    "@media only screen and (min-width: 1024px)": {
      maxWidth: 166,
    },
    "@media only screen and (max-width: 767px)": {
      maxWidth: "unset",
    },
  },
  iconWrap: {
    marginBottom: 2,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 18,
      marginRight: 0,
    },
  },
  noMargin: {
    margin: 0,
  },
  green: {
    color: colors.GREEN(1),
    marginRight: 0,
  },
  red: {
    color: colors.RED(1),
    marginLeft: 0,
    marginRight: 12,
  },
  sentimentBar: {
    height: "inherit",
  },
  sentimentMidpoint: {
    background: "#fff",
    border: `1px solid ${colors.GREY(1)}`,
    borderRadius: "50%",
    height: 10,
    left: "50%",
    transform: "translateX(-50%)",
    position: "absolute",
    width: 10,
    zIndex: 2,
  },
  pointRightBorder: {
    borderRadius: "0 8px 8px 0",
    left: "50%",
    position: "absolute",
    zIndex: 1,
  },
  pointLeftBorder: {
    borderRadius: "8px 0 0 8px",
    position: "absolute",
    right: "50%",
    zIndex: 1,
  },
  resultImg: { fontSize: 10, height: 10, width: 10, marginRight: 4 },
  resultText: { marginLeft: 4 },
  resultWrap: {
    alignItems: "center",
    display: "flex",
    fontSize: 11,
    fontWeight: 500,
    justifyContent: "center",
    width: "100%",
  },
  noSupportImg: {
    color: colors.RED(1),
    fontSize: 10,
    height: 10,
    width: 10,
  },
  neutralImg: {
    fontSize: 10,
    height: 10,
    width: 10,
  },
  cursorPointer: { cursor: "pointer" },
});

const mapStateToProps = (state) => ({
  currentUser: getCurrentUserLegacy(state),
});

export default connect(mapStateToProps, null)(CitationConsensusItem);
