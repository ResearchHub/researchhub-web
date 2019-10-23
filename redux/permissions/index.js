import * as actions from "./actions";
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
      action = actions.setPermissions(body);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

const PermissionsActions = {
  fetchPermissions,
  fetchPermissionsPending: actions.setPermissionsPending,
};

export default PermissionsActions;
