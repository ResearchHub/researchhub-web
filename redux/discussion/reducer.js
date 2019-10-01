import * as types from "./types";

export const initialState = {
  threadId: null,
  commentCount: 0,
  comments: [],
  commentPage: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_THREAD_PENDING:
      return {
        ...state,
        ...action.payload,
      };
    case types.FETCH_THREAD_FAILURE:
      return {
        ...state,
        ...action.payload,
      };
    case types.FETCH_THREAD_SUCCESS:
      return {
        ...action.payload,
      };

    case types.FETCH_COMMENTS_FAILURE:
      return state;
    case types.FETCH_COMMENTS_SUCCESS:
      const { commentCount, comments, commentPage } = action.payload;
      return {
        ...state,
        commentCount,
        comments,
        commentPage,
      };

    default:
      return state;
  }
}
