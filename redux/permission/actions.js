import * as types from "./types";

export function setPermissionsPending() {
  return {
    type: types.FETCH_PERMISSIONS_PENDING,
    payload: { doneFetching: false },
  };
}
export function setPermissions(res) {
  return {
    type: types.FETCH_PERMISSIONS_SUCCESS,
    payload: { data: res, doneFetching: true, success: true },
  };
}
export function setPermissionsFailure() {
  return {
    type: types.FETCH_PERMISSIONS_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}
