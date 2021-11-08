import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { DOWNVOTE, UPVOTE } from "~/config/constants";
import { getCurrentUser } from "~/config/utils/user";
import { ID } from "~/config/types/root_types";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { ReactElement } from "react";
import API from "~/config/api";
import VoteWidgetV2, { VoteMeta } from "~/components/VoteWidgetV2";

type Props = {
  citationID: ID;
  currentUser?: any; // Redux
  updateLastFetchTime: Function;
  voteMeta: VoteMeta;
};

function CitationVoteItem({
  citationID,
  currentUser,
  voteMeta,
  updateLastFetchTime,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.citationVoteItem)}>
      <VoteWidgetV2
        downVoteAPI={API.CITATIONS_VOTE({ citationID, voteType: DOWNVOTE })}
        shouldAllowVote={!isNullOrUndefined(currentUser?.id)}
        upVoteAPI={API.CITATIONS_VOTE({ citationID, voteType: UPVOTE })}
        voteMeta={voteMeta}
        onUpdateSuccess={updateLastFetchTime}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state),
});

export default connect(mapStateToProps, null)(CitationVoteItem);

const styles = StyleSheet.create({
  citationVoteItem: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    width: "100%",
  },
});
