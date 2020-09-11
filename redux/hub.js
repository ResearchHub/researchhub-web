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
  UPDATE_SUBSCRIBED_HUBS: "@@hub/UPDATE_SUBSCRIBED_HUBS",
  UPDATE_TOP_HUBS: "@@hub/UPDATE_TOP_HUBS",
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
    // Passing large page limit to return all hubs for hubs page
    return (dispatch) => {
      return fetch(API.HUB({ pageLimit: 1000 }), API.GET_CONFIG())
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
          console.error(err);
          return dispatch({
            type: HubConstants.GET_HUBS_FAILURE,
            payload: {
              hubs: [],
            },
          });
        });
    };
  },
  getTopHubs: (auth) => {
    // call is defaulted to return 10
    return (dispatch) => {
      return fetch(API.SORTED_HUB({}), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          let topHubs = [...resp.results];
          if (auth && auth.isLoggedIn) {
            console.log("auth", auth);
          }

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
  updateHub: (prevState, newHubState) => {
    return (dispatch) => {
      let { topHubs, subscribedHubs, hubs } = prevState;

      let allHubIndex = shims.findIndexById(newHubState.id, hubs);
      let topHubIndex = shims.findIndexById(newHubState.id, topHubs);

      let updatedHubsList = [...hubs];
      let updatedTopHubsList = [...topHubs];
      let updatedSubscribedHubsList = [...subscribedHubs];

      updatedHubsList[allHubIndex] = newHubState;
      updatedTopHubsList[topHubIndex] = newHubState;

      if (newHubState.user_is_subscribed) {
        updatedSubscribedHubsList.push(newHubState);
      } else {
        let subscribedHubIndex = shims.findIndexById(
          newHubState.id,
          subscribedHubs
        );
        updatedSubscribedHubsList.splice(subscribedHubIndex, 1);
      }

      return dispatch({
        type: HubConstants.UPDATE_HUB,
        payload: {
          subscribedHubs: updatedSubscribedHubsList,
          topHubs: updatedTopHubsList,
          hubs: updatedHubsList,
        },
      });
    };
  },
  updateSubscribedHubs: (subscribedHubs) => {
    return (dispatch) => {
      return dispatch({
        type: HubConstants.UPDATE_SUBSCRIBED_HUBS,
        payload: {
          subscribedHubs: [...subscribedHubs],
        },
      });
    };
  },
  updateTopHubs: (updatedTopHubs) => {
    return (dispatch) => {
      return dispatch({
        type: HubConstants.UPDATE_TOP_HUBS,
        payload: {
          topHubs: updatedTopHubs,
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
  subscribedHubs: [],
};

const HubReducer = (state = defaultHubState, action) => {
  switch (action.type) {
    case HubConstants.UPDATE_CURRENT_HUB_PAGE:
    case HubConstants.GET_HUBS_SUCCESS:
    case HubConstants.GET_HUBS_FAILURE:
    case HubConstants.UPDATE_HUB:
    case HubConstants.GET_TOP_HUBS_SUCCESS:
    case HubConstants.UPDATE_SUBSCRIBED_HUBS:
    case HubConstants.UPDATE_TOP_HUBS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const shims = {
  subscribedHubs: (hubs) => {
    return hubs.filter((hub) => {
      return hub.user_is_subscribed;
    });
  },
  sortHubs: (allHubs) => {
    let sortedHubs = {};
    allHubs.forEach((hub) => {
      let firstLetter = hub.name.slice(0, 1).toLowerCase();
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
