import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { DOWNVOTE, NEUTRALVOTE, UPVOTE } from "~/config/constants";
import { RhDocumentType, ID } from "~/config/types/root_types";
import VoteWidget from "../VoteWidget";
import { Comment } from "./lib/types";
import { StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import { voteForComment } from "./lib/api";
import { Vote } from "~/config/types/vote";
import { CommentTreeContext } from "./lib/contexts";
import { MessageActions } from "~/redux/message";
const { setMessage, showMessage } = MessageActions;

type Args = {
  score: number;
  userVote: Vote | null;
  documentType: RhDocumentType;
  documentID: ID;
  comment: Comment;
  isHorizontal?: boolean;
};

const CommentVote = ({
  comment,
  score,
  userVote,
  documentType,
  documentID,
  isHorizontal = false,
}: Args) => {
  const commentTreeState = useContext(CommentTreeContext);
  const [_score, _setScore] = useState<number>(score);
  const [_userVote, _setUserVote] = useState(userVote);
  const dispatch = useDispatch();

  const handleVoteSuccess = ({ userVote }: { userVote: Vote }) => {
    const newUserVote = userVote;
    const currentUserVote = _userVote;
    let newScore = _score;
    if (newUserVote.voteType === NEUTRALVOTE) {
      if (currentUserVote?.voteType === UPVOTE) {
        newScore -= 1;
      } else if (currentUserVote?.voteType === DOWNVOTE) {
        newScore += 1;
      }
    } else {
      if (newUserVote.voteType === UPVOTE) {
        if (currentUserVote?.voteType === DOWNVOTE) {
          newScore += 2;
        } else {
          newScore += 1;
        }
      } else if (newUserVote.voteType === DOWNVOTE) {
        if (currentUserVote?.voteType === UPVOTE) {
          newScore -= 2;
        } else {
          newScore -= 1;
        }
      }
    }

    _setScore(newScore);
    _setUserVote(newUserVote);
    const updateComment = Object.assign({}, comment, { userVote: newUserVote });
    commentTreeState.onUpdate({ comment: updateComment });
  };

  return (
    <VoteWidget
      score={_score}
      horizontalView={isHorizontal}
      onUpvote={async () => {
        try {
          const userVote = await voteForComment({
            voteType: "upvote",
            commentId: comment.id,
            documentId: documentID,
            documentType,
          });
          handleVoteSuccess({ userVote });
        } catch (error) {
          // @ts-ignore
          dispatch(setMessage(error));
          // @ts-ignore
          dispatch(showMessage({ show: true, error: true }));
        }
      }}
      // @ts-ignore
      onNeutralVote={async () => {
        try {
          const userVote = await voteForComment({
            voteType: "neutralvote",
            commentId: comment.id,
            documentId: documentID,
            documentType,
          });
          handleVoteSuccess({ userVote });
        } catch (error) {
          // @ts-ignore
          dispatch(setMessage(error));
          // @ts-ignore
          dispatch(showMessage({ show: true, error: true }));
        }
      }}
      onDownvote={async () => {
        try {
          const userVote = await voteForComment({
            voteType: "downvote",
            commentId: comment.id,
            documentId: documentID,
            documentType,
          });
          handleVoteSuccess({ userVote });
        } catch (error) {
          // @ts-ignore
          dispatch(setMessage(error));
          // @ts-ignore
          dispatch(showMessage({ show: true, error: true }));
        }
      }}
      selected={_userVote ? _userVote.voteType : null}
      isPaper={documentType === "paper"}
      type={documentType}
      // pillClass={styles.pill}
      downvoteStyleClass={styles.downvote}
      upvoteStyleClass={styles.upvote}
      styles={[styles.voteWidgetWrapper]}
    />
  );
};

const styles = StyleSheet.create({
  downvote: {
    fontSize: 16,
    marginLeft: 2,
    color: colors.secondary.text,
  },
  upvote: {
    fontSize: 16,
    marginRight: 2,
    marginLeft: -1,
    color: colors.secondary.text,
  },
  pill: {
    background: "unset",
    minWidth: 15,
    width: "auto",
  },
  voteWidgetWrapper: {
    marginRight: 0,
  },
});

export default CommentVote;
