/***
 * Action / Reducer file for authentication / user handling
 */

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

import API from "../config/api";
import { Helpers } from "@quantfive/js-web-config";

export const AuthConstants = {
  LOGIN: "@@auth/LOGIN",
  REGISTER: "@@auth/REGISTER",
  FETCHING_REGISTER: "@@auth/FETCHING_REGISTER",
  FETCHING_LOGIN: "@@auth/FETCHING_LOGIN",
  FETCHING_USER: "@@auth/FETCHING_USER",
  GOT_USER: "@@auth/GOT_USER",
  ERROR: "@@auth/ERROR",
  UPDATE_USER_PROFILE: "@@auth/UPDATE_USER_PROFILE",
  SAVING_PROFILE_CHANGES: "@@auth/SAVING_PROFILE_CHANGES",
  SAVED_PROFILE_CHANGES: "@@auth/SAVED_PROFILE_CHANGES",
  UPDATE_SIGNUP_INFO: "@@auth/UPDATE_SIGNUP_INFO",
};

function saveToLocalStorage(key, value) {
  var storage = window.localStorage;
  storage.setItem(key, value);
  return;
}

const TOKEN = "researchhub.auth.token";

let getUserHelper = (dispatch, dispatchFetching) => {
  if (!dispatchFetching) {
    dispatch({ type: AuthConstants.FETCHING_USER, isFetchingUser: true });
  }
  var config = API.GET_CONFIG();
  return fetch(API.USER, config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((json) => {
      if (json.results.length > 0) {
        return dispatch({
          type: AuthConstants.GOT_USER,
          isFetchingUser: false,
          isLoggedIn: true,
          authChecked: true,
          user: json.results[0],
        });
      }

      return dispatch({
        type: AuthConstants.GOT_USER,
        isFetchingUser: false,
        isLoggedIn: false,
        authChecked: true,
      });
    })
    .catch((error) => {
      dispatch({
        type: AuthConstants.GOT_USER,
        isFetchingUser: false,
        authChecked: true,
      });
      return error;
    });
};

export const AuthActions = {
  /***
   * Login with django-rest-auth
   * @params {params} -- a dict of str username/email, str password
   */
  login: (params) => {
    return (dispatch) => {
      var postConfig = API.POST_CONFIG(params);
      delete postConfig["headers"]["Authorization"];
      dispatch({ type: AuthConstants.FETCHING_LOGIN, isFetchingLogin: true });
      return fetch(API.LOGIN, postConfig)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((json) => {
          saveToLocalStorage(TOKEN, json.token);
          return dispatch({
            type: AuthConstants.LOGIN,
            isLoggedIn: true,
            isFetchingLogin: false,
            error: null,
          });
        })
        .catch((error) => {
          if (error.message) {
            return dispatch({
              type: AuthConstants.ERROR,
              error: error.message,
            });
          } else {
            return dispatch({
              type: AuthConstants.ERROR,
              error: error,
            });
          }
        });
    };
  },

  /**
   * Register with django-rest-auth
   * @params {params} -- a dict of str username, str email, str password
   */
  register: (params) => {
    params["password2"] = params.password;
    params["password1"] = params.password;
    params["employee"] = true;
    var postConfig = API.POST_CONFIG(params);
    delete postConfig["headers"]["Authorization"];
    return (dispatch) => {
      dispatch({
        type: AuthConstants.FETCHING_REGISTER,
        isFetchingRegister: true,
      });
      return fetch(API.REGISTER, postConfig)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((json) => {
          saveToLocalStorage(TOKEN, json.key);

          return dispatch({
            type: AuthConstants.REGISTER,
            isLoggedIn: true,
            isFetchingRegister: false,
            error: null,
          });
        })
        .catch((error) => {
          if (error.message) {
            return dispatch({
              type: AuthConstants.ERROR,
              error: error.message,
            });
          } else {
            return dispatch({
              type: AuthConstants.ERROR,
              error: error,
            });
          }
        });
    };
  },

  /**
   * Signs a user out
   */
  signout: () => {
    return (dispatch) => {
      return fetch(API.SIGNOUT, API.POST_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((json) => {
          window.localStorage.removeItem(TOKEN);
          window.location.replace("/");
        });
    };
  },

  /**
   * Gets a user profile back from the backend
   */
  getUser: (dispatchFetching = false) => {
    return (dispatch) => {
      return getUserHelper(dispatch, dispatchFetching);
    };
  },

  /**
   * update signup info
   * @param  {String} id -- String id of info needed to be updated
   * @param  {String} value -- String value
   */
  updateSignupInfo: (id, value) => {
    return (dispatch) => {
      var param = { signupInfo: {} };
      param.signupInfo[`${id}`] = value;
      return dispatch({
        type: AuthConstants.UPDATE_SIGNUP_INFO,
        signupInfo: param.signupInfo,
      });
    };
  },

  /**
   * update the profile on frontend
   */
  updateUser: (params) => {
    return (dispatch) => {
      return dispatch({
        type: AuthConstants.UPDATE_USER_PROFILE,
        user: params,
      });
    };
  },

  /***
   * Save changes to user profile
   */
  saveProfileChanges: () => {
    return (dispatch, getState) => {
      let user = getState().auth.user;
      let putConfig = API.PUT_CONFIG(user);
      dispatch({
        type: AuthConstants.SAVING_PROFILE_CHANGES,
        savingProfileChanges: true,
      });
      return fetch(API.USER + `${user.id}/`, putConfig)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((json) => {
          return dispatch({
            type: AuthConstants.SAVED_PROFILE_CHANGES,
            savingProfileChanges: false,
          });
        });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultAuthState = {
  isLoggedIn: false,
  isFetchingLogin: false,
  generatingAPIKey: false,
  authChecked: false,
  user: {},
  error: null,
};

const AuthReducer = (state = defaultAuthState, action) => {
  switch (action.type) {
    case AuthConstants.LOGIN:
    case AuthConstants.REGISTER:
    case AuthConstants.FETCHING_REGISTER:
    case AuthConstants.FETCHING_LOGIN:
    case AuthConstants.FETCHING_USER:
    case AuthConstants.GOT_USER:
    case AuthConstants.ERROR:
      return {
        ...state,
        ...action,
      };
    case AuthConstants.UPDATE_SIGNUP_INFO:
      return {
        ...state,
        ...action,
        signupInfo: { ...state.signupInfo, ...action.signupInfo },
      };
    case AuthConstants.UPDATE_USER_PROFILE:
      return {
        ...state,
        ...action,
        user: { ...state.user, ...action.user },
      };
    default:
      return state;
  }
};

export default AuthReducer;
