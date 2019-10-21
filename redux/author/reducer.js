import * as types from "./types";

const defaultAuthorState = {
  university: {},
  authoredPapers: {},
};

const AuthorReducer = (state = defaultAuthorState, action) => {
  switch (action.type) {
    case types.GET_AUTHOR:
    case types.GET_AUTHORED_PAPERS_PENDING:
    case types.GET_AUTHORED_PAPERS_PENDING:
    case types.GET_AUTHORED_PAPERS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default AuthorReducer;
