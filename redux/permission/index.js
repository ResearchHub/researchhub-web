import * as actions from "./actions";
import * as shims from "./shims";
import API from "~/config/api";
import * as utils from "../utils";

export function fetchPermissions() {
  return async (dispatch) => {
    const response = await fetch(API.PERMISSIONS(), API.GET_CONFIG()).catch(
      utils.handleCatch
    );

    let action = actions.setPermissionsFailure();

    if (response.ok) {
      const body = await response.json();
      const permissions = shims.permissions(body);
      action = actions.setPermissions(permissions);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

const PermissionActions = {
  fetchPermissions,
  fetchPermissionsPending: actions.setPermissionsPending,
};

export default PermissionActions;
