import * as types from "./types";

const defaultPaperState = {
  authors: [],
  uploadedPaper: {},
  uploadedPaperMeta: {},
  hubs: [],
  threads: [],
  threadCount: 0,
  editHistory: {
    next: null,
    results: [],
    count: null,
  },
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
    // NEW ADDITION
    case types.UPDATE_THREADS:
    case types.UPDATE_THREAD_STATE:
    case types.UPDATE_COMMENT_STATE:
    case types.UPDATE_REPLY_STATE:
    case types.PAGINATE_DISCUSSION_BY_TYPE:
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
