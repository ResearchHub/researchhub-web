import { useCallback, useState } from "react";
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
  faArrowAltUp,
  faArrowAltDown,
} from "@fortawesome/pro-regular-svg-icons";
import colors from "./lib/colors";

type Args = {
  score: number;
  userVote: VoteType | null | undefined;
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
  const [_score, _setScore] = useState<number>(score);
  const [_userVote, _setUserVote] = useState(userVote);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  const handleVoteSuccess = ({ voteType }) => {
    let newScore = _score;
    if (voteType === NEUTRALVOTE) {
      if (_userVote === UPVOTE) {
        newScore -= 1;
      } else if (_userVote === DOWNVOTE) {
        newScore += 1;
      }
    }

    _setScore(newScore);
    _setUserVote(voteType);
  };

  const onUpvote = useCallback(() => {
    if (currentUser) {
      return createVoteHandler({
        dispatch,
        currentAuthor: currentUser?.authorProfile,
        currentVote: _userVote,
        documentCreatedBy: nullthrows(comment.createdBy),
        documentID,
        documentType,
        onError: () => null,
        onSuccess: handleVoteSuccess,
        voteType: UPVOTE,
      });
    }
    return null;
  }, [currentUser, _userVote, comment, documentID, documentType]);

  const onDownvote = useCallback(() => {
    if (currentUser) {
      return createVoteHandler({
        dispatch,
        currentAuthor: currentUser?.authorProfile,
        currentVote: _userVote,
        documentCreatedBy: nullthrows(comment.createdBy),
        documentID,
        documentType,
        onError: () => null,
        onSuccess: handleVoteSuccess,
        voteType: DOWNVOTE,
      });
    }
    return null;
  }, [currentUser, _userVote, comment, documentID, documentType]);

  const onNeutralVote = useCallback(() => {
    if (currentUser) {
      return createVoteHandler({
        dispatch,
        currentAuthor: currentUser?.authorProfile,
        currentVote: _userVote,
        documentCreatedBy: nullthrows(comment.createdBy),
        documentID,
        documentType: documentType,
        onError: () => null,
        onSuccess: handleVoteSuccess,
        voteType: NEUTRALVOTE,
      });
    }
    return null;
  }, [currentUser, _userVote, comment, documentID, documentType]);

  return (
    <VoteWidget
      score={_score}
      horizontalView={true}
      onUpvote={onUpvote}
      // @ts-ignore
      onNeutralVote={onNeutralVote}
      onDownvote={onDownvote}
      selected={_userVote}
      isPaper={documentType === "paper"}
      type={documentType}
      pillClass={styles.pill}
      downvoteStyleClass={styles.downvote}
      upvoteStyleClass={styles.upvote}
      styles={[styles.voteWidgetWrapper]}
      downvoteIcon={<FontAwesomeIcon icon={faArrowAltDown} />}
      upvoteIcon={<FontAwesomeIcon icon={faArrowAltUp} />}
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
