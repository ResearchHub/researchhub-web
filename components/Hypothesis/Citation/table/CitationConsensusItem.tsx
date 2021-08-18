import { css, StyleSheet } from "aphrodite";
import React, { Fragment, ReactElement, useCallback, useState } from "react";
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

  const hasCurrUserVoted = !isNullOrUndefined(userVote);
  const [shouldShowConsensus, setShouldShowConsensus] = useState<boolean>(
    !hasCurrUserVoted
  );

  const handleReject = useCallback((): void => {
    setLocalConsensusMeta({
      ...localConsensusMeta,
      userVote: true,
      downCount: downCount + 1,
    });
    setTotalCount(totalCount + 1);
    setMajority(upCount >= downCount + 1 ? UPVOTE : DOWNVOTE);
    setShouldShowConsensus(true);
    postCitationVote({
      citationID,
      onSuccess: () => {}, // TODO: calvinhlee - move callback to here. after auth-vote fix
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
    setLocalConsensusMeta({
      ...localConsensusMeta,
      upCount: upCount + 1,
      userVote: true,
    });
    setTotalCount(totalCount + 1);
    setMajority(upCount + 1 >= downCount ? UPVOTE : DOWNVOTE);
    setShouldShowConsensus(true);
    postCitationVote({
      citationID,
      onSuccess: () => {}, // TODO: calvinhlee - move callback to here. after auth-vote fix
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
  const consensus = (
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
          style={{
            color: doesMajoritySupport ? colors.GREEN(1) : colors.RED(1),
          }}
        >{`${majorityPercent * 100}% of researchers think ${
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
  const vote = (
    <Fragment>
      <div
        className={css(
          styles.button,
          totalCount > 1 && styles.centerRejectButton
        )}
        onClick={handleReject}
        role="button"
      >
        {icons.timesCircle}
        <span className={css(styles.iconWrap)}></span>
        <span className={css(styles.buttonText)}>{"Reject"}</span>
      </div>
      <div
        className={css(styles.button, styles.green)}
        onClick={handleSupport}
        role="button"
      >
        {icons.checkCircle}
        <span className={css(styles.iconWrap)}></span>
        <span className={css(styles.buttonText)}>{"Support"}</span>
      </div>
    </Fragment>
  );

  return (
    <div className={css(styles.citationConsensusItem)}>
      {totalCount > 1 ? consensus : null}
      {hasCurrUserVoted ? null : (
        <div className={css(styles.vote, totalCount > 1 && styles.centerVote)}>
          {vote}
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
  vote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    color: colors.LIGHT_GREY_TEXT,
    cursor: "pointer",
    display: "flex",
    marginRight: 16,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      marginRight: 8,
    },
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
  centerRejectButton: {
    marginRight: 13,
  },
  consensusBar: {
    alignItems: "center",
    background: colors.LIGHT_GREY_BORDER,
    borderRadius: 8,
    display: "flex",
    marginTop: 8,
    marginBottom: 8,
    height: 8,
    justifyContent: "center",
    position: "relative",
    // maxWidth: "137px",
    width: "100%",
  },
  consensusWrap: {
    alignItems: "center",
    // display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    maxHeight: 28,
  },
  iconWrap: {
    marginRight: 4,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 24,
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
