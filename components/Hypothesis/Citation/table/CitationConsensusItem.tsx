import { css, StyleSheet } from "aphrodite";
import { Fragment, ReactElement, useCallback, useState } from "react";
import { connect } from "react-redux";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { getCurrentUser } from "~/config/utils/user";
import { ID } from "~/config/types/root_types";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
} from "~/config/utils/nullchecks";
import { postCitationVote } from "../../api/postCitationVote";
import icons from "~/config/themes/icons";

export type ConsensusMeta = {
  downCount: number;
  upCount: number;
  userVote: Object;
};

type CitationConsensusItemProps = {
  citationID: ID;
  consensusMeta: ConsensusMeta;
  currentUser?: any; // Redux
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

function CitationConsensusItem({
  citationID,
  consensusMeta,
}: CitationConsensusItemProps): ReactElement<"div" | typeof Fragment> {
  const [localConsensusMeta, setLocalConsensusMeta] = useState<ConsensusMeta>(
    consensusMeta
  );
  const { downCount, upCount, userVote } = localConsensusMeta || {};
  const [totalCount, setTotalCount] = useState<number>(downCount + upCount);
  const [majority, setMajority] = useState<string>(
    upCount >= downCount ? UPVOTE : DOWNVOTE
  );
  const [hasCurrUserVoted, setHasCurrUserVoted] = useState<boolean>(
    !isNullOrUndefined(userVote)
  );

  const handleReject = useCallback((): void => {
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
    upCount,
  ]);

  const handleSupport = useCallback((): void => {
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
    upCount,
  ]);

  const doesMajoritySupport = majority === UPVOTE;
  const majorityPercent =
    (doesMajoritySupport ? upCount : downCount) / totalCount;
  const weightedPercent = majorityPercent / 2; // each sentimentbar consists 50% of the full bar
  const consensusBar = (
    <div className={css(styles.consensusWrap)}>
      <div className={css(styles.resultWrap)}>
        {doesMajoritySupport ? (
          <img
            className={css(styles.resultImg)}
            src="/static/icons/check.svg"
          />
        ) : (
          <span className={css(styles.noSupportImg)}>{icons.timesCircle}</span>
        )}
        <div
          className={css(styles.consensusText)}
          style={{
            color: doesMajoritySupport ? colors.GREEN(1) : colors.RED(1),
          }}
        >{`${Math.floor(majorityPercent * 100)}% of researchers think ${
          doesMajoritySupport ? "yes" : "no"
        }`}</div>
      </div>
      <div className={css(styles.consensusBar)}>
        <SentimentBar
          color={colors.RED(1)}
          width={doesMajoritySupport ? 0 : weightedPercent * 100}
        />
        <div className={css(styles.sentimentMidpoint)} />
        <SentimentBar
          color={colors.GREEN(1)}
          width={doesMajoritySupport ? weightedPercent * 100 : 0}
          pointRight
        />
      </div>
    </div>
  );

  return (
    <div className={css(styles.citationConsensusItem)}>
      {totalCount > 0 ? consensusBar : null}
      {hasCurrUserVoted ? null : (
        <div className={css(styles.voteWrap)}>
          <div
            className={css(styles.button)}
            onClick={handleReject}
            role="button"
          >
            <span className={css(styles.iconWrap)}>{icons.timesCircle}</span>
            <span className={css(styles.buttonText)}>{"Reject"}</span>
          </div>
          <div
            className={css(styles.button, styles.green)}
            onClick={handleSupport}
            role="button"
          >
            <span className={css(styles.iconWrap)}>{icons.checkCircle}</span>
            <span className={css(styles.buttonText)}>{"Support"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  citationConsensusItem: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  voteWrap: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginTop: 8,
    maxWidth: 166,
    width: "inherit",
  },
  button: {
    alignItems: "center",
    color: colors.LIGHT_GREY_TEXT,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    width: "50%",
  },
  buttonText: {
    display: "block",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
  },
  centerVote: {
    marginLeft: 10,
  },
  consensusBar: {
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
    width: "100%",
    maxWidth: "inherit",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  consensusWrap: {
    height: "100%",
    maxHeight: 28,
    maxWidth: 166,
    width: "100%",
  },
  iconWrap: {
    marginRight: 4,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 18,
      marginRight: 0,
    },
  },
  green: {
    color: colors.GREEN(1),
    marginRight: 0,
  },
  sentimentBar: {
    height: "inherit",
  },
  sentimentMidpoint: {
    background: "#fff",
    border: `1px solid ${colors.GREY(1)}`,
    borderRadius: "50%",
    height: 10,
    left: "calc(50% - 2px) ",
    position: "absolute",
    width: 10,
    zIndex: 2,
  },
  pointRightBorder: {
    borderRadius: "0 8px 8px 0",
    left: "calc(50% + 4px)",
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
  },
  noSupportImg: {
    color: colors.RED(1),
    fontSize: 10,
    height: 10,
    width: 10,
    marginRight: 4,
  },
});

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state),
});

export default connect(
  mapStateToProps,
  null
)(CitationConsensusItem);
