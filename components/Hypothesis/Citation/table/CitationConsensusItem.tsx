import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import React, {
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { getCurrentUser } from "~/config/utils/user";
import { ID } from "~/config/types/root_types";
import { postCitationVote } from "../../api/postCitationVote";
import { UPVOTE, DOWNVOTE, NEUTRALVOTE } from "~/config/constants";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import ReactTooltip from "react-tooltip";

export type ConsensusMeta = {
  downCount: number;
  neutralCount: number;
  upCount: number;
  userVote: Object;
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
  pointRight?: boolean;
  width: number | string;
};

function SentimentBar({
  color,
  pointRight = false,
  width,
}: SentimentBarProps): ReactElement<"div"> {
  return (
    <div
      className={css(
        styles.sentimentBar,
        pointRight ? styles.pointRightBorder : styles.pointLeftBorder
      )}
      style={{ backgroundColor: color, width: `${width}%`, maxWidth: "50%" }}
    ></div>
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
  const isPlural = totalCount > 1;
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
        <img className={css(styles.resultImg)} src="/static/icons/check.svg" />
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
    userVote,
  } = localConsensusMeta ?? {};

  useEffectSyncLocalConsensusMeta({
    consensusMeta,
    localConsensusMeta,
    setLocalConsensusMeta,
  });

  const [totalCount, setTotalCount] = useState<number>(
    downCount + upCount + neutralCount
  );
  const [majority, setMajority] = useState<string>(
    upCount >= downCount ? UPVOTE : DOWNVOTE
  );
  const [hasCurrUserVoted, setHasCurrUserVoted] = useState<boolean>(
    !isNullOrUndefined(userVote)
  );

  const handleReject = useCallback((): void => {
    if (!shouldAllowVote) {
      return;
    }
    const updatedMeta = {
      ...localConsensusMeta,
      downCount: downCount + 1,
    };
    setLocalConsensusMeta(updatedMeta);
    setTotalCount(totalCount + 1);
    setMajority(upCount >= downCount + 1 ? UPVOTE : DOWNVOTE);
    setHasCurrUserVoted(true);
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
  }, [
    downCount,
    localConsensusMeta,
    setMajority,
    setTotalCount,
    totalCount,
    shouldAllowVote,
    upCount,
  ]);

  const handleNeutralVote = useCallback((): void => {
    if (!shouldAllowVote) {
      return;
    }
    const updatedMeta = {
      ...localConsensusMeta,
      neutralCount: neutralCount + 1,
    };
    setLocalConsensusMeta(updatedMeta);
    setTotalCount(totalCount + 1);
    setHasCurrUserVoted(true);
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
  }, [
    downCount,
    localConsensusMeta,
    setMajority,
    setTotalCount,
    shouldAllowVote,
    totalCount,
    upCount,
  ]);

  const handleSupport = useCallback((): void => {
    if (!shouldAllowVote) {
      return;
    }
    const updatedMeta = {
      ...localConsensusMeta,
      upCount: upCount + 1,
    };
    setLocalConsensusMeta(updatedMeta);
    setTotalCount(totalCount + 1);
    setMajority(upCount + 1 >= downCount ? UPVOTE : DOWNVOTE);
    setHasCurrUserVoted(true);
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
  }, [
    downCount,
    localConsensusMeta,
    setMajority,
    setTotalCount,
    totalCount,
    shouldAllowVote,
    upCount,
  ]);

  // This is a way to avoid NaN & not return any element
  if (totalCount === 0 && Boolean(userVote)) {
    return null;
  }

  const isNeutral = (upCount ?? 0) === downCount;
  const doesMajoritySupport = !isNeutral && majority === UPVOTE;
  const majorityPercent =
    ((doesMajoritySupport ? upCount : downCount) / totalCount) * 100;
  const weightedPercent = majorityPercent / 2; // each sentimentbar consists 50% of the full bar
  const consensusDetailText = getDetailedText({
    citationID,
    disableText: Boolean(disableText),
    doesMajoritySupport,
    isNeutral,
    majorityPercent,
    totalCount,
  });
  const consensusBar =
    totalCount > 0 ? (
      <div className={css(styles.consensusWrap)}>
        {consensusDetailText}
        <Fragment>
          {isNeutral ? (
            <div className={css(styles.consensusInnerWrap)}>
              <SentimentBar color={colors.LIGHT_GREY_BORDER} width={25} />
              <div className={css(styles.sentimentMidpoint)} />
              <SentimentBar
                color={colors.LIGHT_GREY_BORDER}
                width={25}
                pointRight
              />
            </div>
          ) : (
            <div className={css(styles.consensusInnerWrap)}>
              <SentimentBar
                color={colors.RED(1)}
                width={doesMajoritySupport ? 0 : weightedPercent}
              />
              <div className={css(styles.sentimentMidpoint)} />
              <SentimentBar
                color={colors.GREEN(1)}
                width={doesMajoritySupport ? weightedPercent : 0}
                pointRight
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
        {hasCurrUserVoted ? null : (
          <div className={css(styles.voteWrap)}>
            <div
              className={css(styles.button, styles.red)}
              onClick={handleReject}
              role="button"
            >
              <div className={css(styles.iconWrap)}>{icons.timesCircle}</div>
              <div className={css(styles.buttonText)}>{"Reject"}</div>
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
              <div className={css(styles.buttonText)}>{"Support"}</div>
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
    // marginRight: 4,
    marginBottom: 2,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 18,
      marginRight: 0,
    },
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
  resultWrap: {
    display: "flex",
    fontSize: 11,
    fontWeight: 500,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  noSupportImg: {
    color: colors.RED(1),
    fontSize: 10,
    height: 10,
    width: 10,
    marginRight: 4,
  },
  neutralImg: {
    fontSize: 10,
    height: 10,
    width: 10,
    marginRight: 4,
  },
});

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state),
});

export default connect(mapStateToProps, null)(CitationConsensusItem);
