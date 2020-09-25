import * as types from "./types";

export const initialState = {};

const VoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.POST_VOTE_PENDING:
    case types.POST_VOTE_FAILURE:
      return {
        ...state,
        ...action.payload,
      };
    case types.POST_VOTE_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default VoteReducer;
