import { Fragment, useState, useEffect } from "react";
import Router from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import moment from "moment";

import VoteWidget from "~/components/VoteWidget";
import AuthorAvatar from "~/components/AuthorAvatar";

import { summaryVote } from "~/config/fetch";
import DiscussionPostMetadata from "../DiscussionPostMetadata";

const SummaryContributor = (props) => {
  const { summary, hideMeta, loadingSummary, voteStyles } = props;
  const authorProfile = summary.proposed_by
    ? summary.proposed_by.author_profile
    : {};

  const [score, setScore] = useState(summary.score || 0);
  const [userVote, setUserVote] = useState(summary.user_vote);
  const [selected, setSelected] = useState(
    summary.user_vote ? summary.user_vote.vote_type : false
  );

  useEffect(() => {
    setUserVote(props.summary.user_vote);
    setSelected(
      props.summary.user_vote ? props.summary.user_vote.vote_type : false
    );
  }, [props.summary.user_vote]);

  useEffect(() => {
    setScore(props.summary.score);
  }, [props.summary.score]);

  const onUpvote = () => {
    summaryVote(
      {
        type: "upvote",
        summaryId: summary.id,
      },
      (res) => {
        if (userVote) {
          setScore(score + 2);
        } else {
          setScore(score + 1);
          setUserVote(res);
        }
        setSelected(1);
      }
    );
  };

  const onDownvote = () => {
    summaryVote(
      {
        type: "downvote",
        summaryId: summary.id,
      },
      (res) => {
        if (userVote) {
          setScore(score - 2);
        } else {
          setScore(score - 1);
          setUserVote(res);
        }
        setSelected(2);
      }
    );
  };

  /**
   * Needed by DiscussionPostMetadata component to allow users to support/award content
   */
  const formatMetadata = () => ({
    contentType: "summary",
    objectId: summary.id,
  });

  return (
    <div className={css(styles.metaRow)}>
      <VoteWidget
        score={score}
        selected={selected}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
        promoted={false}
      />
      {!hideMeta && (
        <DiscussionPostMetadata
          data={summary}
          username={authorProfile.first_name + " " + authorProfile.last_name}
          authorProfile={authorProfile}
          date={summary.approved_date}
          fullDate={true}
          metaData={formatMetadata()}
          fetching={loadingSummary}
        />
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  metaRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  column: {
    width: 178,
    marginLeft: 8,
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  date: {
    fontSize: 14,
    fontWeight: 400,
    fontWeight: 500,
  },
  selected: {},
  user: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 3,
  },
});

export default SummaryContributor;
