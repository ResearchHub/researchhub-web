import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const HubConstants = {
  UPDATE_CURRENT_HUB_PAGE: "@@hub/UPDATE_CURRENT_HUB_PAGE",
  GET_HUBS_SUCCESS: "@@hub/GET_HUBS_SUCCESS",
  GET_HUBS_FAILURE: "@@hub/GET_HUBS_FAILURE",
  UPDATE_HUB: "@@hub/UPDATE_HUB",
  GET_TOP_HUBS_SUCCESS: "@@hub/GET_TOP_HUBS_SUCCESS",
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
  getTopHubs: () => {
    return (dispatch) => {
      return fetch(API.SORTED_HUB({}), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          return dispatch({
            type: HubConstants.GET_TOP_HUBS_SUCCESS,
            payload: {
              topHubs: [...resp.results],
            },
          });
        });
    };
  },
  /**
   * Updates the state of 'user_is_subscribed' on the FE when changes are made to the FE
   * @param { Object } - the hub object
   * @param { Boolean } - the new subscribed state of the hub
   */
  updateHub: (allHubs, topHubs, newHubState) => {
    return (dispatch) => {
      let allHubIndex = shims.findIndexById(newHubState.id, allHubs);
      let topHubIndex = shims.findIndexById(newHubState.id, topHubs);
      let updatedHubsList = [...allHubs];
      let updatedTopHubsList = [...topHubs];
      updatedHubsList[allHubIndex] = newHubState;
      updatedTopHubsList[topHubIndex] = newHubState;
      return dispatch({
        type: HubConstants.UPDATE_HUB,
        payload: {
          topHubs: updatedTopHubsList,
          allHubs: updatedHubsList,
        },
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
  topHubs: [],
  hubsByAlpha: {},
  fetchedHubs: false,
};

const HubReducer = (state = defaultHubState, action) => {
  switch (action.type) {
    case HubConstants.UPDATE_CURRENT_HUB_PAGE:
    case HubConstants.GET_HUBS_SUCCESS:
    case HubConstants.GET_HUBS_FAILURE:
    case HubConstants.UPDATE_HUB:
    case HubConstants.GET_TOP_HUBS_SUCCESS:
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
  findIndexById: (hubId, allHubs) => {
    for (let i = 0; i < allHubs.length; i++) {
      if (hubId === allHubs[i].id) {
        return i;
      }
    }
  },
};

export default HubReducer;
