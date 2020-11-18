import { Fragment, useState, useEffect } from "react";
import Router from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import moment from "moment";

import VoteWidget from "~/components/VoteWidget";
import AuthorAvatar from "~/components/AuthorAvatar";

import { summaryVote } from "~/config/fetch";

const SummaryContributor = (props) => {
  const { summary, hideMeta, voteStyles } = props;

  const [score, setScore] = useState(summary.score);
  const [userVote, setUserVote] = useState(summary.user_vote);
  const [selected, setSelected] = useState(
    summary.user_vote ? summary.user_vote.vote_type : false
  );

  useEffect(() => {
    console.log("summary", summary);
  }, []);

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

  if (hideMeta) {
    return (
      <VoteWidget
        score={score}
        selected={selected}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
        styles={voteStyles}
        promoted={false}
      />
    );
  }

  return (
    <div className={css(styles.metaRow)}>
      <VoteWidget
        score={score}
        selected={selected}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
        promoted={false}
      />
      <AuthorAvatar
        author={summary.proposed_by.author_profile}
        size={30}
        disableLink={true}
        trueSize={true}
      />
      <div className={css(styles.column)}>
        <div className={css(styles.date)}>
          {moment(summary.approved_date).format("MMM Do YYYY, h:mm A")}
        </div>
        <div
          className={css(styles.user)}
        >{`${summary.proposed_by.author_profile.first_name} ${summary.proposed_by.author_profile.last_name}`}</div>
      </div>
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
