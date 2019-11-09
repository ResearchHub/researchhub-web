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
          let hubs = [...resp.results];
          let hubsByAlpha = shims.sortHubs([...hubs]);
          return dispatch({
            type: HubConstants.GET_HUBS_SUCCESS,
            payload: {
              hubs,
              hubsByAlpha,
              fetchedHubs: true,
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
  // addNewHub: (name) => {
  //   return dispatch => {
  //     let param = { name };
  //     return fetch(API.HUB({}), API.POST_CONFIG(param))
  //       .then(Helpers.checkStatus)
  //       .then(Helpers.parseJSON)
  //       .then(res => {

  //       })
  //   }
  //  }
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultHubState = {
  currentHub: {},
  hubs: [],
  hubsByAlpha: {},
  fetchedHubs: false,
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

const shims = {
  sortHubs: (allHubs) => {
    let sortedHubs = {};
    allHubs.forEach((hub) => {
      let firstLetter = hub.name[0].toLowerCase();
      if (sortedHubs[firstLetter]) {
        sortedHubs[firstLetter].push(hub);
      } else {
        sortedHubs[firstLetter] = [hub];
      }
    });
    return sortedHubs;
  },
};

export default HubReducer;
