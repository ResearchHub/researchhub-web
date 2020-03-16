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
};

export const NotificationActions = {
  getLivefeed: (prevState, hubId = 0, page = 1) => {
    return (dispatch) => {
      dispatch({ type: NotificationConstants.GET_LIVEFEED });
      return fetch(API.GET_LIVE_FEED({ hubId, page }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let livefeed = shims.handleChanges(
            prevState,
            { ...res },
            hubId,
            page
          );
          return dispatch({
            type: NotificationConstants.LIVEFEED_UPDATED,
            payload: {
              livefeed,
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
  livefeed: {},
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

const shims = {
  handleChanges: (prevState, newResults, hubId, page) => {
    var updatedFeed = { ...prevState };
    if (doesNotExist(prevState.currentHub) || prevState.currentHub !== hubId) {
      updatedFeed.currentHub = hubId;
      updatedFeed.count = newResults.count;
      updatedFeed.results = newResults.results;
      updatedFeed.grabbedPage = { 0: true };
      return updatedFeed;
    } else {
      if (!updatedFeed.grabbedPage[page]) {
        // append to results if new page
        updatedFeed.results = [...updatedFeed.results, ...newResults.results];
        updatedFeed.grabbedPage[page] = true; // add page to cache
        return updatedFeed;
      }
      return updatedFeed;
    }
  },
};

export default NotificationReducer;
