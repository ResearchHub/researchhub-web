import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const HubConstants = {
  UPDATE_CURRENT_HUB_PAGE: "@@hub/UPDATE_CURRENT_HUB_PAGE",
  GET_HUBS_SUCCESS: "@@hub/GET_HUBS_SUCCESS",
  GET_HUBS_FAILURE: "@@hub/GET_HUBS_FAILURE",
};

export const HubActions = {
  /**
   * Updates Hub state when user switches hub pages
   * @param: object -- object that contains hub
   */
  updateCurrentHubPage: (hub) => {
    return (dispatch) => {
      return dispatch({
        type: HubConstants.UPDATE_CURRENT_HUB_PAGE,
        payload: {
          currentHub: hub,
        },
      });
    };
  },
  getHubs: () => {
    return (dispatch) => {
      return fetch(API.HUB({}), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          let hubs = resp.count > 0 ? [...resp.results] : [];
          return dispatch({
            type: HubConstants.GET_HUBS_SUCCESS,
            payload: {
              hubs,
            },
          });
        })
        .catch((err) => {
          return dispatch({
            type: HubConstants.GET_HUBS_FAILURE,
            payload: {
              hubs: [],
            },
          });
        });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultHubState = {
  currentHub: {},
  hubs: [],
};

const HubReducer = (state = defaultHubState, action) => {
  switch (action.type) {
    case HubConstants.UPDATE_CURRENT_HUB_PAGE:
    case HubConstants.GET_HUBS_SUCCESS:
    case HubConstants.GET_HUBS_FAILURE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default HubReducer;
