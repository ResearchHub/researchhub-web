import * as types from "./types";

export const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_THREAD_PENDING:
    case types.FETCH_THREAD_FAILURE:
    case types.FETCH_THREAD_SUCCESS:
    case types.POST_COMMENT_PENDING:
    case types.POST_COMMENT_FAILURE:
    case types.POST_COMMENT_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case types.FETCH_COMMENTS_PENDING:
    case types.FETCH_COMMENTS_FAILURE:
    case types.FETCH_COMMENTS_SUCCESS:
      return {
        ...state,
        commentPage: { ...action.payload },
      };

    default:
      return state;
  }
}
