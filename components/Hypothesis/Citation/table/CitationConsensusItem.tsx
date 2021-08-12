import { css, StyleSheet } from "aphrodite";
import React, { Fragment, ReactElement, useState } from "react";
import { connect } from "react-redux";
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
} from "../../../../config/constants";
import colors from "../../../../config/themes/colors";
import icons from "../../../../config/themes/icons";
import { getCurrentUser } from "../../../../config/utils";
import { isNullOrUndefined } from "../../../../config/utils/nullchecks";

export type ConsensusMeta = {
  downCount: number;
  upCount: number;
  userVote: Object;
};

type Props = {
  consensusMeta: ConsensusMeta;
  currentUser?: any; // Redux
};

function CitationConsensusItem({
  consensusMeta,
  currentUser,
}: Props): ReactElement<"div"> {
  const { downCount, upCount, userVote } = consensusMeta || {};
  const canCurrUserVote =
    !isNullOrUndefined(currentUser) && isNullOrUndefined(userVote);

  const [countWinner, setCountWinner] = useState<string>(
    upCount >= downCount ? UPVOTE : DOWNVOTE
  );
  const [shouldShowConsensus, setShouldShowConsensus] = useState<boolean>(
    !canCurrUserVote
  );
  const [totalCount, setTotalCount] = useState<number>(downCount + upCount);

  const body = shouldShowConsensus ? (
    <div>CONSENSUS</div>
  ) : (
    <Fragment>
      <div className={css(styles.button)} role="button">
        <span className={css(styles.iconWrap)}>{icons.timesCircle}</span>
        {"Reject"}
      </div>
      <div className={css(styles.button, styles.green)} role="button">
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
  },
  button: {
    alignItems: "center",
    color: colors.TEXT_GREY(1),
    cursor: "pointer",
    display: "flex",
    marginRight: 16,
  },
  iconWrap: {
    marginRight: 4,
  },
  green: {
    color: colors.GREEN(1),
  },
});

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state),
});

export default connect(
  mapStateToProps,
  null
)(CitationConsensusItem);
