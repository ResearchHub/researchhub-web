import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { DOWNVOTE, NEUTRALVOTE, UPVOTE } from "~/config/constants";
import VoteWidget from "../VoteWidget";
import { StyleSheet } from "aphrodite";
import { Vote } from "~/config/types/vote";
import { MessageActions } from "~/redux/message";
import { voteForDocument } from "./api/voteForDocument";
import { ID } from "~/config/types/root_types";
import { ApiDocumentType, DocumentMetadata } from "./lib/types";
import useCacheControl from "~/config/hooks/useCacheControl";
import { DocumentContext } from "./lib/DocumentContext";

const { setMessage, showMessage } = MessageActions;

type Args = {
  id: ID;
  score: number;
  userVote: Vote|null;
  metadata: DocumentMetadata;
  apiDocumentType: ApiDocumentType;
  isHorizontal?: boolean;
};

const DocumentVote = ({ id, metadata, score, userVote, apiDocumentType, isHorizontal = false, }: Args) => {
  const documentContext = useContext(DocumentContext);
  const dispatch = useDispatch();
  const [revalidatePage] = useCacheControl();

  const handleVoteSuccess = ({ newUserVote }: { newUserVote: Vote }) => {
    const currentUserVote = userVote;
    let newScore = score;
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

    console.log('newScore', newScore)
    console.log('newUserVote', newUserVote)
    console.log('currentUserVote', currentUserVote)

    documentContext?.updateMetadata({
      ...metadata,
      score: newScore,
      userVote: newUserVote,
    });
    revalidatePage();
  };

  return (
    <VoteWidget
      score={score}
      horizontalView={isHorizontal}
      onUpvote={async () => {
        try {
          const userVote = await voteForDocument({
            voteType: "upvote",
            documentId: id,
            documentType: apiDocumentType,
          });
          handleVoteSuccess({ newUserVote: userVote });
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
          const userVote = await voteForDocument({
            voteType: "neutralvote",
            documentId: id,
            documentType: apiDocumentType,
          });
          handleVoteSuccess({ newUserVote: userVote });
        } catch (error) {
          // @ts-ignore
          dispatch(setMessage(error));
          // @ts-ignore
          dispatch(showMessage({ show: true, error: true }));
        }
      }}
      onDownvote={async () => {
        try {
          const userVote = await voteForDocument({
            voteType: "downvote",
            documentId: id,
            documentType: apiDocumentType,
          });
          handleVoteSuccess({ newUserVote: userVote });
        } catch (error) {
          // @ts-ignore
          dispatch(setMessage(error));
          // @ts-ignore
          dispatch(showMessage({ show: true, error: true }));
        }
      }}
      selected={userVote ? userVote.voteType : null}
      isPaper={apiDocumentType === "paper"}
      type={apiDocumentType}
      pillClass={isHorizontal && styles.pill}
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
  },
  upvote: {
    fontSize: 16,
    marginRight: 2,
    marginLeft: -1,
  },
  pill: {
    background: "unset",
  },
  voteWidgetWrapper: {
    marginRight: 0,
  },
});

export default DocumentVote;
