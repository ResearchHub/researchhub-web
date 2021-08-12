import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, useState } from "react";
import { connect } from "react-redux";
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
} from "../../../../config/constants";
import { getCurrentUser } from "../../../../config/utils";
import { isNullOrUndefined } from "../../../../config/utils/nullchecks";

type Props = {
  consensusMeta: { down_count: number; up_count: number; user_vote: Object };
  currentUser: any; // Redux
};

function CitationConsensusItem({
  consensusMeta,
  currentUser,
}: Props): ReactElement<"div"> {
  const {
    down_count: downCount,
    up_count: upCount,
    user_vote: userVote,
  } = consensusMeta;
  const totalCount = downCount + upCount;
  const countWinner = upCount >= downCount ? UPVOTE : DOWNVOTE;
  const canCurrUserVote =
    !isNullOrUndefined(currentUser) && isNullOrUndefined(userVote);
  const [shouldShowConsensus, setShouldShowConsensus] = useState<boolean>(
    !canCurrUserVote
  );
  if (shouldShowConsensus) {
    return <div>CONSENSUS</div>;
  } else {
    return <div></div>;
  }
}

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state),
});

export default connect(
  mapStateToProps,
  null
)(CitationConsensusItem);
