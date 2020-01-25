import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const NotificationConstants = {
  GET_LIVEFEED: "@@notification/GET_LIVEFEED",
  LIVEFEED_UPDATED: "@@notification/LIVEFEED_UPDATED",
  LIVEFEED_STATIC: "@@notification/LIVEFEED_STATIC",
};

export const NotificationActions = {
  getLivefeed: (prevState, hubId) => {
    console.log("hubId", hubId);
    console.log("path", API.GET_LIVE_FEED({ hubId }));
    return (dispatch) => {
      dispatch({ type: NotificationConstants.GET_LIVEFEED });
      return fetch(API.GET_LIVE_FEED({ hubId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          console.log("res", res);
          // Prevent unnecessary state change and re-rendering
          if (prevState[hubId]) {
            if (prevState[hubId].length === res.results.length) {
              return dispatch({ type: NotificationConstants.LIVEFEED_STATIC });
            }
          }

          let updatedHubs = { ...prevState };
          updatedHubs[hubId] = [...res.results];

          return dispatch({
            type: NotificationConstants.LIVEFEED_UPDATED,
            payload: {
              hubs: updatedHubs,
            },
          });
        });
    };
  },
  hideNotificationByIndex: (prevState, hubId, index) => {
    let updatedHubs;
    return (dispatch) => {};
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultNotificationState = {
  hubs: {},
};

const NotificationReducer = (state = defaultNotificationState, action) => {
  switch (action.type) {
    case NotificationConstants.LIVEFEED_UPDATED:
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

export default NotificationReducer;
