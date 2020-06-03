import * as types from "./types";

const defaultPaperState = {
  authors: [],
  uploadedPaper: {},
  uploadedPaperMeta: {},
  hubs: [],
  editHistory: [],
  doneFetchingPaper: false,
};

const PaperReducer = (state = defaultPaperState, action) => {
  switch (action.type) {
    case types.GET_THREADS:
    case types.GET_PAPER:
    case types.GET_EDITS:
    case types.POST_PAPER_PENDING:
    case types.POST_PAPER_FAILURE:
    case types.POST_PAPER_SUCCESS:
    case types.POST_PAPER_SUMMARY_PENDING:
    case types.POST_PAPER_SUMMARY_FAILURE:
    case types.POST_PAPER_SUMMARY_SUCCESS:
    case types.PATCH_PAPER_PENDING:
    case types.PATCH_PAPER_FAILURE:
    case types.PATCH_PAPER_SUCCESS:
    case types.PUT_PAPER_PENDING:
    case types.PUT_PAPER_FAILURE:
    case types.PUT_PAPER_SUCCESS:
    case types.UPLOAD_PAPER_TO_STATE:
    case types.REMOVE_PAPER_FROM_STATE:
    case types.CLEAR_POSTED_PAPER:
    case types.UPDATE_PAPER_STATE:
    case types.GET_TWITTER_THREADS:
      return {
        ...state,
        ...action.payload,
      };

    case types.GET_PAPER_USER_VOTE_PENDING:
    case types.GET_PAPER_USER_VOTE_FAILURE:
    case types.GET_PAPER_USER_VOTE_SUCCESS:
      return {
        ...state,
        userVote: { ...action.payload },
      };

    default:
      return state;
  }
};

export default PaperReducer;
