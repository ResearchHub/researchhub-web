import { UPVOTE, NEUTRALVOTE } from "~/config/constants";
import API from "~/config/api";
import {
  AuthorProfile,
  RHUser,
  VoteType,
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
import { RESEARCHHUB_POST_DOCUMENT_TYPES } from "~/config/utils/getUnifiedDocType";
import { Helpers } from "@quantfive/js-web-config";
import { handleCatch } from "~/redux/utils";

type Args = {
  currentAuthor: AuthorProfile;
  currentVote: VoteType | null | undefined;
  commentPayload?: {
    commentID?: string;
    commentType?: string;
    replyID?: string;
    threadID?: string;
  };
  documentCreatedBy: RHUser;
  documentID: ID;
  documentType: RhDocumentType;
  onError: Function;
  onSuccess: ({
    increment,
    voteType,
  }: {
    increment: number;
    voteType: VoteType;
  }) => void;
  voteType: VoteType;
  dispatch: any;
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
  dispatch,
}: Args) => {
  const formattedDocumentType = RESEARCHHUB_POST_DOCUMENT_TYPES.includes(
    documentType
  )
    ? "researchhubpost"
    : documentType;
  const resolvedDocumentAuthorID =
    documentCreatedBy?.authorProfile?.id ||
    documentCreatedBy?.author_profile?.id;

  return async (event: SyntheticEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
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
      voteType === UPVOTE ? 1 : voteType === NEUTRALVOTE ? 0 : -1;

    // optimistic update
    onSuccess({
      increment:
        Boolean(currentVote) && currentVote !== NEUTRALVOTE
          ? increment * 2
          : increment,
      voteType,
    });

    return fetch(
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
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .catch((error: Error): void => {
        // @ts-ignore
        if (error?.response?.status === 429) {
          handleCatch(error, dispatch);
        }
        onError(error);
      });
  };
};
