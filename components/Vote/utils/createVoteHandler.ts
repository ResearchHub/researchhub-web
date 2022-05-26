import { UPVOTE, DOWNVOTE } from "~/config/constants";
import API from "~/config/api";
import { AuthorProfile, UnifiedDocument } from "~/config/types/root_types";

type Args = {
  voteType: string,
  unifiedDocument: UnifiedDocument,
  currentAuthor: AuthorProfile,
  selectedUserVote?: string,
  onSuccess: Function,
  onError: Function,
}

const getVoteUrl = ({ voteType, unifiedDocument }) => {
  console.log(unifiedDocument)
  if (unifiedDocument.documentType === "post") {
    if (voteType === UPVOTE) {
      return API.RH_POST_UPVOTE(unifiedDocument.document.id); 
    }
    else if (voteType === DOWNVOTE) {
      return API.RH_POST_DOWNVOTE(unifiedDocument.document.id); 
    }
  }
  else if (unifiedDocument.documentType === "paper") {
    if (voteType === UPVOTE) {
      return API.UPVOTE(unifiedDocument.documentType, unifiedDocument.document.id); 
    }
    else if (voteType === DOWNVOTE) {
      return API.DOWNVOTE(unifiedDocument.documentType, unifiedDocument.document.id); 
    }
  }
}

export const createVoteHandler = ({
  voteType,
  unifiedDocument,
  currentAuthor,
  selectedUserVote,
  onError,
  onSuccess,
}: Args) => {
  const voteStrategies = {
    [UPVOTE]: {
      increment: 1,
      url: getVoteUrl({ voteType, unifiedDocument }),
    },
    [DOWNVOTE]: {
      increment: -1,
      url: getVoteUrl({ voteType, unifiedDocument }),
    },
  };

  console.log(voteStrategies)

  const { increment, url } = voteStrategies[voteType];

  const handleVote = async () => {
    const response = await fetch(url, API.POST_CONFIG()).catch(
      (error) => {
        console.log("Failed to cast vote", error);
      }
    );

    return onSuccess({ voteType, increment });
  };

  return async (e) => {
    e.stopPropagation();

    if (!currentAuthor?.id) {
      console.log("Not logged in");
      return;
    }
    else if (currentAuthor.id === unifiedDocument.createdBy?.authorProfile.id) {
      console.log("Trying to vote on own's document");
      return;
    }

    // if (selectedUserVote === voteType) {
    //   /**
    //    * Deselect
    //    * NOTE: This will never be called with the current implementation of
    //    * VoteWidget, because it disables the onVote/onDownvote callback
    //    * if the button is already selected.
    //    */
    //   this.setState((prev) => ({
    //     voteState: null,
    //     score: prev.score - increment, // Undo the vote
    //   }));
    // } else {
    //   this.setState({ voteState: voteType });
    //   if (
    //     this.state.voteState === UPVOTE ||
    //     this.state.voteState === DOWNVOTE
    //   ) {
    //     // If post was already upvoted / downvoted by user, then voting
    //     // oppoistely will reverse the score by twice as much
    //     this.setState((prev) => ({ score: prev.score + increment * 2 }));
    //   } else {
    //     // User has not voted, so regular vote
    //     this.setState((prev) => ({ score: prev.score + increment }));
    //   }
    // }

    await handleVote();
  };
};
