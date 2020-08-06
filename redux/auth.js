/***
 * Action / Reducer file for authentication / user handling
 */

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

import API from "../config/api";
import { Helpers } from "~/config/helpers";
import { AUTH_TOKEN } from "../config/constants";
import { useDispatch } from "react-redux";
import { ModalActions } from "./modals";
import { HubActions } from "./hub";
import * as utils from "./utils";
import * as Sentry from "@sentry/browser";

export const AuthConstants = {
  LOGIN: "@@auth/LOGIN",
  LOGIN_FAILURE: "@@auth/LOGIN_FAILURE",
  REGISTER: "@@auth/REGISTER",
  FETCHING_REGISTER: "@@auth/FETCHING_REGISTER",
  FETCHING_LOGIN: "@@auth/FETCHING_LOGIN",
  FETCHING_USER: "@@auth/FETCHING_USER",
  GOT_USER: "@@auth/GOT_USER",
  ERROR: "@@auth/ERROR",
  ORCID_CONNECT_PENDING: "@@auth/ORCID_CONNECT_PENDING",
  ORCID_CONNECT_FAILURE: "@@auth/ORCID_CONNECT_FAILURE",
  ORCID_CONNECT_SUCCESS: "@@auth/ORCID_CONNECT_SUCCESS",
  UPDATE_USER_PROFILE: "@@auth/UPDATE_USER_PROFILE",
  SAVING_PROFILE_CHANGES: "@@auth/SAVING_PROFILE_CHANGES",
  SAVED_PROFILE_CHANGES: "@@auth/SAVED_PROFILE_CHANGES",
  UPDATE_SIGNUP_INFO: "@@aut/UPDATE_SIGNUP_INFO",
  GET_USER_BANNER_PREFERENCE: "@@auth/GET_USER_BANNER_PREFERENCE",
  SET_USER_BANNER_PREFERENCE: "@@auth/SET_USER_BANNER_PREFERENCE",
  SET_UPLOADING_PAPER: "@@auth/SET_UPLOADING_PAPER",
  CHECK_USER_FIRST_TIME: "@@auth/CHECK_USER_FIRST_TIME",
  UPDATE_USER_COIN_ACTION: "@@auth/UPDATE_USER_COIN_ACTION",
  SET_WALLETLINK: "@@auth/SET_WALLETLINK",
};

function saveToLocalStorage(key, value) {
  var storage = window.localStorage;
  storage.setItem(key, value);
  return;
}

const alertSignedUp = (userId) => {
  let params = {
    user: userId,
  };
  return fetch(API.ANALYTICS_WEBSITEVIEWS({}), API.PATCH_REQUEST(params)).then(
    Helpers.checkStatus
  );
};

let getUserHelper = (dispatch, dispatchFetching) => {
  if (!dispatchFetching) {
    dispatch({ type: AuthConstants.FETCHING_USER, isFetchingUser: true });
  }
  var config = API.GET_CONFIG();
  return fetch(API.USER({}), config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((json) => {
      if (json.results[0]) {
        dispatch(HubActions.updateSubscribedHubs(json.results[0].subscribed)); // updates the subscribedHubs on Hub Redux State
      }

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
      console.log("error", error);
      Sentry.captureException(error);
      window.localStorage.removeItem(AUTH_TOKEN);
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
          saveToLocalStorage(AUTH_TOKEN, json.token);
          return dispatch({
            type: AuthConstants.LOGIN,
            isLoggedIn: true,
            isFetchingLogin: false,
            error: null,
          });
        })
        .catch((error) => {
          Sentry.captureException(error);
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
          saveToLocalStorage(AUTH_TOKEN, json.key);

          return dispatch({
            type: AuthConstants.REGISTER,
            isLoggedIn: true,
            isFetchingRegister: false,
            error: null,
          });
        })
        .catch((error) => {
          Sentry.captureException(error);
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
   * Login with Google
   * @params { params } --
   */
  googleLogin: (params) => {
    return (dispatch, getState) => {
      params.uuid = getState().auth.user.uuid;
      let postConfig = API.POST_CONFIG(params);
      delete postConfig["headers"]["Authorization"];
      return fetch(API.GOOGLE_LOGIN, postConfig)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((json) => {
          saveToLocalStorage(AUTH_TOKEN, json.key);
          return dispatch({
            type: AuthConstants.LOGIN,
            isLoggedIn: true,
            isFetchingLogin: false,
            loginFailed: false,
          });
        })
        .catch((error) => {
          Sentry.captureException(error);
          return dispatch({
            type: AuthConstants.LOGIN_FAILURE,
            isLoggedIn: false,
            isFetchingLogin: false,
            loginFailed: true,
          });
        });
    };
  },

  /**
   * Login with google yolo
   */
  googleYoloLogin: (params) => {
    return (dispatch, getState) => {
      params.uuid = getState().auth.user.uuid;
      let postConfig = API.POST_CONFIG(params);
      delete postConfig["headers"]["Authorization"];
      return fetch(API.GOOGLE_YOLO, postConfig)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((json) => {
          saveToLocalStorage(AUTH_TOKEN, json.key);
          return dispatch({
            type: AuthConstants.LOGIN,
            isLoggedIn: true,
            isFetchingLogin: false,
            loginFailed: false,
          });
        })
        .catch((error) => {
          Sentry.captureException(error);
          return dispatch({
            type: AuthConstants.LOGIN_FAILURE,
            isLoggedIn: false,
            isFetchingLogin: false,
            loginFailed: true,
          });
        });
    };
  },

  /**
   * Login with ORCID
   */
  orcidLogin: (params) => {
    return (dispatch) => {
      saveToLocalStorage(AUTH_TOKEN, params["token"]);
      return dispatch({
        type: AuthConstants.LOGIN,
        isLoggedIn: true,
        isFetchingLogin: false,
        loginFailed: false,
      });
    };
  },
  /**
   * Connect ORCID account to existing user account
   */
  orcidConnect: (params) => {
    return (dispatch) => {
      let postConfig = API.POST_CONFIG({
        access_token: params.accessToken,
        orcid: params.orcid,
      });
      return fetch(API.ORCID_CONNECT, postConfig)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((json) => {
          return dispatch({
            type: AuthConstants.ORCID_CONNECT_SUCCESS,
            orcidConnectFailure: false,
            orcidConnectPending: false,
            orcidConnectSuccess: true,
          });
        })
        .catch((error) => {
          Sentry.captureException(error);
          if (error.response && error.response.status === 401) {
            console.log(error.response);
          } else {
            console.log(error);
          }
          return dispatch({
            type: AuthConstants.ORCID_CONNECT_FAILURE,
            orcidConnectFailure: true,
            orcidConnectPending: false,
            orcidConnectSuccess: false,
          });
        });
    };
  },

  /**
   * Signs a user out
   */
  signout: ({ walletLink }) => {
    return (dispatch) => {
      return fetch(API.SIGNOUT, API.POST_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(() => {
          try {
            if (walletLink) {
              walletLink.disconnect();
            }
          } catch (error) {
            console.error(error);
          }
          window.localStorage.removeItem(AUTH_TOKEN);
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
  /**
   * if user is uploading a paper
   */
  setUploadingPaper: (bool) => {
    return (dispatch) => {
      return dispatch({
        type: AuthConstants.SET_UPLOADING_PAPER,
        uploadingPaper: bool,
      });
    };
  },
  getUserBannerPreference: () => {
    return (dispatch) => {
      let preference = localStorage.getItem("researchhub.banner.pref");
      if (preference === "true") {
        return dispatch({
          type: AuthConstants.GET_USER_BANNER_PREFERENCE,
          showBanner: true,
        });
      } else if (preference === "false") {
        return dispatch({
          type: AuthConstants.GET_USER_BANNER_PREFERENCE,
          showBanner: false,
        });
      } else if (preference === null || preference === undefined) {
        localStorage.setItem("researchhub.banner.pref", true);
        return dispatch({
          type: AuthConstants.GET_USER_BANNER_PREFERENCE,
          showBanner: true,
        });
      }
    };
  },
  /**
   * sets preference for hub page banner
   * @param { Boolean } showBanner - true to show banner / false to hide banner
   */
  setUserBannerPreference: (showBanner) => {
    return (dispatch) => {
      localStorage.setItem("researchhub.banner.pref", showBanner);
      return dispatch({
        type: AuthConstants.SET_USER_BANNER_PREFERENCE,
        showBanner: showBanner,
      });
    };
  },
  updateUserCoinAction: (action) => {
    return (dispatch) => {
      return dispatch({
        type: AuthConstants.UPDATE_USER_COIN_ACTION,
        userCoinACtion: action,
      });
    };
  },
  checkUserFirstTime: (firstTime) => {
    return (dispatch) => {
      if (firstTime) {
        dispatch(ModalActions.openFirstVoteModal(true));
      }
    };
  },

  setWalletLink: (walletLink) => {
    return (dispatch) => {
      return dispatch({
        type: AuthConstants.SET_WALLETLINK,
        walletLink,
      });
    };
  },

  // /***
  //  * Save changes to user profile
  //  */
  // saveProfileChanges: () => {
  //   return (dispatch, getState) => {
  //     let user = getState().auth.user;
  //     let putConfig = API.PUT_CONFIG(user);
  //     dispatch({
  //       type: AuthConstants.SAVING_PROFILE_CHANGES,
  //       savingProfileChanges: true,
  //     });
  //     return fetch(API.USER + `${user.id}/`, putConfig)
  //       .then(Helpers.checkStatus)
  //       .then(Helpers.parseJSON)
  //       .then((json) => {
  //         return dispatch({
  //           type: AuthConstants.SAVED_PROFILE_CHANGES,
  //           savingProfileChanges: false,
  //         });
  //       });
  //   };
  // },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultAuthState = {
  isLoggedIn: false,
  isFetchingLogin: false,
  loginFailed: false,
  generatingAPIKey: false,
  authChecked: false,
  orcidConnectFailure: false,
  orcidConnectPending: false,
  orcidConnectSuccess: false,
  user: {},
  error: null,
  showBanner: true,
  uploadingPaper: false,
  userCoinAction: "",
  uuid: null,
  walletLink: null,
};

const AuthReducer = (state = defaultAuthState, action) => {
  switch (action.type) {
    case AuthConstants.LOGIN:
    case AuthConstants.LOGIN_FAILURE:
    case AuthConstants.REGISTER:
    case AuthConstants.FETCHING_REGISTER:
    case AuthConstants.FETCHING_LOGIN:
    case AuthConstants.FETCHING_USER:
    case AuthConstants.GOT_USER:
    case AuthConstants.ERROR:
    case AuthConstants.SET_USER_BANNER_PREFERENCE:
    case AuthConstants.GET_USER_BANNER_PREFERENCE:
    case AuthConstants.SET_UPLOADING_PAPER:
    case AuthConstants.SET_WALLETLINK:
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
    case AuthConstants.CHECK_USER_FIRST_TIME:
    default:
      return state;
  }
};

export default AuthReducer;
