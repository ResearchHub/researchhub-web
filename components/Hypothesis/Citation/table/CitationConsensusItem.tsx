import { css, StyleSheet } from "aphrodite";
import React, { Fragment, ReactElement, useCallback, useState } from "react";
import { connect } from "react-redux";
import { UPVOTE, DOWNVOTE } from "../../../../config/constants";
import colors from "../../../../config/themes/colors";
import icons from "../../../../config/themes/icons";
import { getCurrentUser } from "../../../../config/utils";
import { isNullOrUndefined } from "../../../../config/utils/nullchecks";

export type ConsensusMeta = {
  downCount: number;
  upCount: number;
  userVote: Object;
};

type CitationConsensusItemProps = {
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
  consensusMeta,
  currentUser,
}: CitationConsensusItemProps): ReactElement<"div" | typeof Fragment> {
  const [localConsensusMeta, setLocalConsensusMeta] = useState<ConsensusMeta>(
    consensusMeta
  );
  const { downCount, upCount, userVote } = localConsensusMeta || {};
  const [totalCount, setTotalCount] = useState<number>(downCount + upCount);
  const [majority, setMajority] = useState<string>(
    upCount >= downCount ? UPVOTE : DOWNVOTE
  );
  const canCurrUserVote =
    !isNullOrUndefined(currentUser) && isNullOrUndefined(userVote);
  const [shouldShowConsensus, setShouldShowConsensus] = useState<boolean>(
    !canCurrUserVote
  );

  const handleReject = useCallback((): void => {
    setLocalConsensusMeta({ ...localConsensusMeta, downCount: downCount + 1 });
    setTotalCount(totalCount + 1);
    setMajority(upCount >= downCount + 1 ? UPVOTE : DOWNVOTE);
    setShouldShowConsensus(true);
    // TODO: calvinhlee - api call
  }, [
    downCount,
    localConsensusMeta,
    setMajority,
    setTotalCount,
    totalCount,
    upCount,
  ]);

  const handleSupport = useCallback((): void => {
    setLocalConsensusMeta({ ...localConsensusMeta, upCount: upCount + 1 });
    setTotalCount(totalCount + 1);
    setMajority(upCount + 1 >= downCount ? UPVOTE : DOWNVOTE);
    setShouldShowConsensus(true);
    // TODO: calvinhlee - api call
  }, [
    downCount,
    localConsensusMeta,
    setMajority,
    setTotalCount,
    totalCount,
    upCount,
  ]);
  const majorityPercent =
    (majority === UPVOTE ? upCount : downCount) / totalCount;
  const weightedPercent = majorityPercent / 2; // each sentimentbar consists 50% of the full bar
  const body = shouldShowConsensus ? (
    <div className={css(styles.consensusWrap)}>
      <div>{`Total vote: ${totalCount}`}</div>
      <div className={css(styles.consensusBar)}>
        <SentimentBar
          color={colors.RED(1)}
          width={majority === UPVOTE ? 0 : weightedPercent * 100}
        />
        <div className={css(styles.sentimentMidpoint)} />
        <SentimentBar
          color={colors.GREEN(1)}
          width={majority === UPVOTE ? weightedPercent * 100 : 0}
          pointRight
        />
      </div>
    </div>
  ) : (
    <Fragment>
      <div className={css(styles.button)} onClick={handleReject} role="button">
        <span className={css(styles.iconWrap)}>{icons.timesCircle}</span>
        {"Reject"}
      </div>
      <div
        className={css(styles.button, styles.green)}
        onClick={handleSupport}
        role="button"
      >
        <span className={css(styles.iconWrap)}>{icons.checkCircle}</span>
        {"Support"}
      </div>
    </Fragment>
  );

  return <div className={css(styles.citationConsensusItem)}>{body}</div>;
}

const styles = StyleSheet.create({
  citationConsensusItem: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  button: {
    alignItems: "center",
    color: colors.TEXT_GREY(1),
    cursor: "pointer",
    display: "flex",
    marginRight: 16,
  },
  consensusBar: {
    alignItems: "center",
    background: colors.GREY(1),
    borderRadius: 8,
    display: "flex",
    height: 8,
    justifyContent: "center",
    position: "relative",
    width: "100%",
  },
  consensusWrap: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    maxHeight: 28,
    width: "80%",
  },
  iconWrap: {
    marginRight: 4,
  },
  green: {
    color: colors.GREEN(1),
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
    right: "calc(50% - 2px)",
    zIndex: 1,
  },
});

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state),
});

export default connect(
  mapStateToProps,
  null
)(CitationConsensusItem);
