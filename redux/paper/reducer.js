import * as types from "./types";

const defaultPaperState = {
  authors: [],
  uploadedPaper: {},
  hubs: [],
};

const PaperReducer = (state = defaultPaperState, action) => {
  switch (action.type) {
    case types.GET_PAPER:
    case types.POST_PAPER_PENDING:
    case types.POST_PAPER_FAILURE:
    case types.POST_PAPER_SUCCESS:
    case types.POST_PAPER_SUMMARY_PENDING:
    case types.POST_PAPER_SUMMARY_FAILURE:
    case types.POST_PAPER_SUMMARY_SUCCESS:
    case types.UPLOAD_PAPER_TO_STATE:
    case types.REMOVE_PAPER_FROM_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default PaperReducer;
