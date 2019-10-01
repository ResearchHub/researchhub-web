import * as types from "./types";

export const initialState = {};

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
        ...state,
        ...action.payload,
      };

    case types.FETCH_COMMENTS_PENDING:
      return {
        ...state,
        commentPage: { ...action.payload },
      };
    case types.FETCH_COMMENTS_FAILURE:
      return state;
    case types.FETCH_COMMENTS_SUCCESS:
      return {
        ...state,
        commentPage: { ...action.payload },
      };

    default:
      return state;
  }
}
