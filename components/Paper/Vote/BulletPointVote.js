import { useState, useEffect } from "react";

import VoteWidget from "~/components/VoteWidget";

import { bulletVote } from "~/config/fetch";

const BulletPointVote = (props) => {
  const { bulletPoint } = props;

  const [score, setScore] = useState(bulletPoint.score || 0);
  const [userVote, setUserVote] = useState(bulletPoint.user_vote);
  const [selected, setSelected] = useState(
    bulletPoint.user_vote ? bulletPoint.user_vote.vote_type : false
  );

  useEffect(() => {});

  const onUpvote = () => {
    bulletVote(
      {
        type: "upvote",
        bulletId: bulletPoint.id,
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
    bulletVote(
      {
        type: "downvote",
        bulletId: bulletPoint.id,
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

  return (
    <VoteWidget
      score={score}
      selected={selected}
      onUpvote={onUpvote}
      onDownvote={onDownvote}
      fontSize={"15px"}
      width={"40px"}
      promoted={false}
    />
  );
};

export default BulletPointVote;
