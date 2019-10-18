import * as types from "./types";

const defaultAuthorState = {
  university: {},
};

const AuthorReducer = (state = defaultAuthorState, action) => {
  switch (action.type) {
    case types.GET_AUTHOR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default AuthorReducer;
