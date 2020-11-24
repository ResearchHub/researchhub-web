import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { doesNotExist } from "~/config/utils";
/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const NotificationConstants = {
  GET_LIVEFEED: "@@notification/GET_LIVEFEED",
  LIVEFEED_UPDATED: "@@notification/LIVEFEED_UPDATED",
  LIVEFEED_STATIC: "@@notification/LIVEFEED_STATIC",
  FETCH_NOTIFICATION: "@@notification/FETCH_NOTIFICATION",
  FETCH_SUCCESS: "@@notification/FETCH_SUCCESS",
  FETCH_FAILURE: "@@notification/FETCH_FAILURE",
  MARK_AS_READ: "@@notification/MARK_AS_READ",
  MARK_ALL_AS_READ: "@@notification/MARK_ALL_AS_READ",
  ADD_NOTIFICATION: "@@notification/ADD_NOTIFICATION",
};

export const NotificationActions = {
  getLivefeed: ({ hubId = 0, loadMore }) => {
    return (dispatch, getState) => {
      dispatch({ type: NotificationConstants.GET_LIVEFEED });
      const prevState = getState().livefeed.livefeed;
      const ENDPOINT = loadMore ? prevState.next : API.GET_LIVE_FEED({ hubId });

      return fetch(ENDPOINT, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let results = res.results;

          if (loadMore) {
            results = [...prevState.results, ...res.results];
          }

          const livefeed = {
            ...res,
            results,
          };

          return dispatch({
            type: NotificationConstants.LIVEFEED_UPDATED,
            payload: {
              livefeed,
            },
          });
        });
    };
  },
  getNotifications: () => {
    return (dispatch) => {
      dispatch({
        type: NotificationConstants.FETCH_NOTIFICATION,
        payload: { fetching: true, success: false },
      });
      return fetch(API.NOTIFICATION({}), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let notifications = [...res.results];
          return dispatch({
            type: NotificationConstants.FETCH_SUCCESS,
            payload: {
              notifications,
              fetching: false,
              success: true,
            },
          });
        })
        .catch((err) => {
          return dispatch({
            type: NotificationConstants.FETCH_FAILURE,
            payload: {
              fetching: false,
              success: false,
            },
          });
        });
    };
  },
  markAsRead: (prevState, notifId) => {
    return (dispatch) => {
      return fetch(
        API.NOTIFICATION({ notifId }),
        API.PATCH_CONFIG({ read: true })
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let index = shims.findIndexById(prevState, notifId);
          let notifications = [...prevState];
          notifications[index].read = true;
          return dispatch({
            type: NotificationConstants.MARK_AS_READ,
            payload: {
              notifications,
            },
          });
        });
    };
  },
  markAllAsRead: (prevState, ids) => {
    return (dispatch) => {
      return fetch(API.NOTIFICATION({ ids }), API.PATCH_CONFIG({ ids }))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let notifications = prevState.map((notification) => {
            let copy = { ...notification };
            copy.read = true;
            return copy;
          });
          return dispatch({
            type: NotificationConstants.MARK_ALL_AS_READ,
            payload: {
              notifications,
            },
          });
        });
    };
  },
  addNotification: (prevState, notification) => {
    return (dispatch) => {
      let notifications = [notification, ...prevState];
      return dispatch({
        type: NotificationConstants.ADD_NOTIFICATION,
        payload: {
          notifications,
        },
      });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultNotificationState = {
  livefeed: {},
  notifications: [],
};

const NotificationReducer = (state = defaultNotificationState, action) => {
  switch (action.type) {
    case NotificationConstants.LIVEFEED_UPDATED:
    case NotificationConstants.FETCH_NOTIFICATION:
    case NotificationConstants.FETCH_SUCCESS:
    case NotificationConstants.FETCH_FAILURE:
    case NotificationConstants.MARK_AS_READ:
    case NotificationConstants.MARK_ALL_AS_READ:
    case NotificationConstants.ADD_NOTIFICATION:
      return {
        ...state,
        ...action.payload,
      };
    case NotificationConstants.GET_LIVEFEED:
    case NotificationConstants.LIVEFEED_STATIC:
    default:
      return state;
  }
};

const shims = {
  findIndexById: (prevState, notifId) => {
    for (var i = 0; i < prevState.length; i++) {
      if (prevState[i].id === notifId) {
        return i;
      }
    }
  },
};

export default NotificationReducer;
