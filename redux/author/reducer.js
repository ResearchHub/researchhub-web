import * as types from "./types";

const defaultAuthorState = {
  university: {},
  authoredPapers: {
    papers: [],
  },
  userDiscussions: {
    discussions: [],
  },
  userContributions: {
    commentOffset: 0,
    replyOffset: 0,
    paperUploadOffset: 0,
    contributions: [],
  },
};

const AuthorReducer = (state = defaultAuthorState, action) => {
  switch (action.type) {
    case types.GET_AUTHOR:
    case types.SAVE_AUTHOR_CHANGES:
    case types.GET_AUTHORED_PAPERS_PENDING:
    case types.GET_AUTHORED_PAPERS_FAILURE:
    case types.GET_AUTHORED_PAPERS_SUCCESS:
    case types.GET_USER_DISCUSSIONS_PENDING:
    case types.GET_USER_DISCUSSIONS_FAILURE:
    case types.GET_USER_DISCUSSIONS_SUCCESS:
    case types.GET_USER_CONTRIBUTIONS_PENDING:
    case types.GET_USER_CONTRIBUTIONS_FAILURE:
    case types.GET_USER_CONTRIBUTIONS_SUCCESS:
    case types.UPDATE_AUTHOR_BY_KEY:
    case types.UPDATE_AUTHOR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default AuthorReducer;
