import { UPVOTE, DOWNVOTE } from "~/config/constants";
import API from "~/config/api";
import {
  AuthorProfile,
  GrmVoteType,
  ID,
  RhDocumentType,
  User,
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
  documentCreatedBy: User;
  documentID: ID;
  documentType: RhDocumentType;
  onError: Function;
  onSuccess: Function;
  selectedUserVote?: GrmVoteType | null;
  voteType: GrmVoteType;
};

const getVoteUrl = ({ voteType, unifiedDocument }) => {
  if (unifiedDocument?.documentType === "post") {
    if (voteType === UPVOTE) {
      return API.RH_POST_UPVOTE(unifiedDocument.document.id);
    } else if (voteType === DOWNVOTE) {
      return API.RH_POST_DOWNVOTE(unifiedDocument.document.id);
    }
  } else if (unifiedDocument?.documentType === "paper") {
    if (voteType === UPVOTE) {
      return API.UPVOTE(
        unifiedDocument.documentType,
        unifiedDocument.document.id
      );
    } else if (voteType === DOWNVOTE) {
      return API.DOWNVOTE(
        unifiedDocument.documentType,
        unifiedDocument.document.id
      );
    }
  }
};

export const createVoteHandler = ({
  voteType,
  documentType,
  currentAuthor,
  selectedUserVote,
  documentCreatedBy,
  documentID,
  onSuccess,
  onError,
}: Args) => {
  return async (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      !isNullOrUndefined(currentAuthor) &&
      currentAuthor?.id === documentCreatedBy?.author_profile?.id
    ) {
      emptyFncWithMsg(
        `Not logged in or attempted to vote on own ${documentType}.`
      );
      return;
    }

    const increment =
      voteType === "upvote" ? 1 : voteType === "neutralvote" ? 0 : -1;

    if (selectedUserVote === voteType) {
      return;
    } else {
      // optimistic update
      onSuccess(Boolean(selectedUserVote) ? increment * 2 : increment);
    }

    fetch(
      buildGrmVoteApiUri({
        documentType: nullthrows(
          documentType,
          "docType must be present to vote"
        ),
        documentID,
        voteType,
      }),
      API.POST_CONFIG()
    ).catch((error: Error): void => {
      emptyFncWithMsg(error);
    });
  };
};
