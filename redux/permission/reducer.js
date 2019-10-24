import * as types from "./types";

const defaultState = {
  doneFetching: null,
  success: null,
  data: [],
};

const PermissionReducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.FETCH_PERMISSIONS_PENDING:
    case types.FETCH_PERMISSIONS_FAILURE:
    case types.FETCH_PERMISSIONS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default PermissionReducer;
