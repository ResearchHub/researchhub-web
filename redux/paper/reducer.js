import * as types from "./types";

const defaultPaperState = {
  authors: [],
  uploadedPaper: {},
  hubs: [],
  editHistory: [],
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
    case types.GET_EDITS:
      return {
        ...state,
        ...action.payload,
      };
    case types.UPLOAD_PAPER_TO_STATE:
      return {
        ...state,
        uploadedPaper: action.payload.uploadedPaper,
        uploadedPaperTitle: action.payload.uploadedPaperTitle,
      };
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
