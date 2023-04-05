import { useCallback, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DOWNVOTE, NEUTRALVOTE, UPVOTE } from "~/config/constants";
import {
  VoteType,
  RhDocumentType,
  ID,
  parseUser,
} from "~/config/types/root_types";
import { createVoteHandler } from "../Vote/utils/createVoteHandler";
import { RootState } from "~/redux";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import VoteWidget from "../VoteWidget";
import { Comment } from "./lib/types";
import { css, StyleSheet } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUp,
  faDown,
} from "@fortawesome/pro-regular-svg-icons";
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
};

const CommentVote = ({
  comment,
  score,
  userVote,
  documentType,
  documentID,
}: Args) => {
  const commentTreeState = useContext(CommentTreeContext);
  const [_score, _setScore] = useState<number>(score);
  const [_userVote, _setUserVote] = useState(userVote);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  const handleVoteSuccess = ({ userVote }: { userVote:Vote }) => {

    const newUserVote = userVote;
    let newScore = _score;
    if (newUserVote.voteType === NEUTRALVOTE) {
      if (_userVote?.voteType === UPVOTE) {
        newScore -= 1;
      } else if (_userVote?.voteType === DOWNVOTE) {
        newScore += 1;
      }
    } else {
      if (newUserVote.voteType === UPVOTE) {
        newScore += 1;
      }
      else if (newUserVote.voteType === DOWNVOTE) {
        newScore -= 1;
      }
    }
    
    
    _setScore(newScore);
    _setUserVote(newUserVote);
    const updateComment = Object.assign({}, comment, { userVote: newUserVote });
    commentTreeState.onUpdate({ comment: updateComment });
    console.log('updatedComment', updateComment)
  };

  return (
    <VoteWidget
      score={_score}
      horizontalView={true}
      onUpvote={async () => {
        try {
          const userVote = await voteForComment({
            voteType: "upvote",
            commentId: comment.id,
            documentId: documentID,
            documentType, 
          })
          handleVoteSuccess({ userVote })
        }
        catch(error) {
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
          })
          handleVoteSuccess({ userVote })
        }
        catch(error) {
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
          })
          handleVoteSuccess({ userVote })
        }
        catch(error) {
          // @ts-ignore
          dispatch(setMessage(error));
          // @ts-ignore
          dispatch(showMessage({ show: true, error: true }));
        }
      }}
      selected={_userVote ? _userVote.voteType : null}
      isPaper={documentType === "paper"}
      type={documentType}
      pillClass={styles.pill}
      downvoteStyleClass={styles.downvote}
      upvoteStyleClass={styles.upvote}
      styles={[styles.voteWidgetWrapper]}
      downvoteIcon={<FontAwesomeIcon icon={faDown} />}
      upvoteIcon={<FontAwesomeIcon icon={faUp} />}
    />
  );
};

const styles = StyleSheet.create({
  downvote: {
    fontSize: 18,
    marginLeft: 0,
    color: colors.secondary.text,
  },
  upvote: {
    fontSize: 18,
    marginRight: 0,
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
