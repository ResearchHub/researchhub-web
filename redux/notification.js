import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const NotificationConstants = {
  GET_LIVEFEED: "@@notification/GET_LIVEFEED",
  GET_LIVEFEED_SUCCESS: "@@notification/GET_LIVEFEED_SUCCESS",
  GET_LIVEFEED_FAILED: "@@notification/GET_LIVEFEED_FAILED",
};

export const NotificationActions = {
  getLivefeed: (prevState, hubId) => {
    return (dispatch) => {
      return fetch(API.GET_LIVE_FEED({ hubId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          // Add new notifications to state by hubId
          let updatedHubs = { ...prevState };
          // if (updatedHubs[hubId]) {
          //   updatedHubs[hubId] = [...updatedHubs[hubId], res.results ];
          // } else {
          updatedHubs[hubId] = [...res.results];
          // }

          return dispatch({
            type: NotificationConstants.GET_LIVEFEED,
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
    case NotificationConstants.GET_LIVEFEED:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default NotificationReducer;
