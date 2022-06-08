import { UPVOTE, DOWNVOTE } from "~/config/constants";
import API from "~/config/api";
import {
  AuthorProfile,
  CreatedBy,
  GrmVoteType,
  ID,
  RhDocumentType,
} from "~/config/types/root_types";
import { SyntheticEvent } from "react";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
} from "~/config/utils/nullchecks";
import { buildGrmVoteApiUri } from "~/config/utils/buildGrmVoteApiUri";

type Args = {
  currentAuthor: AuthorProfile;
  currentVote: GrmVoteType | null | undefined;
  commentPayload?: {
    commentID?: string;
    commentType?: string;
    replyID?: string;
    threadID?: string;
  };
  documentCreatedBy: any;
  documentID: ID;
  documentType: RhDocumentType;
  onError: Function;
  onSuccess: ({
    increment,
    voteType,
  }: {
    increment: number;
    voteType: GrmVoteType;
  }) => void;
  voteType: GrmVoteType;
};

export const createVoteHandler = ({
  commentPayload,
  currentAuthor,
  currentVote,
  documentCreatedBy,
  documentID,
  documentType,
  onError,
  onSuccess,
  voteType,
}: Args) => {
  const formattedDocumentType =
    documentType === "post" ? "researchhub_posts" : documentType;
  const resolvedDocumentAuthorID =
    documentCreatedBy?.authorProfile?.id ||
    documentCreatedBy?.author_profile?.id;

  return async (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (
      !isNullOrUndefined(currentAuthor) &&
      currentAuthor?.id === resolvedDocumentAuthorID
    ) {
      emptyFncWithMsg(
        `Not logged in or attempted to vote on own ${documentType}.`
      );
      return;
    }

    const increment =
      voteType === "upvote" ? 1 : voteType === "neutralvote" ? 0 : -1;

    if (currentVote === voteType) {
      return;
    } else {
      // optimistic update
      onSuccess({
        increment: Boolean(currentVote) ? increment * 2 : increment,
        voteType,
      });
    }

    fetch(
      buildGrmVoteApiUri({
        commentPayload,
        documentType: nullthrows(
          formattedDocumentType,
          "docType must be present to vote"
        ),
        documentID,
        voteType,
      }),
      API.POST_CONFIG()
    ).catch((error: Error): void => {
      onError(error);
    });
  };
};
