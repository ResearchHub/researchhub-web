import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const HubConstants = {
  UPDATE_CURRENT_HUB_PAGE: "@@hub/UPDATE_CURRENT_HUB_PAGE",
  GET_HUB_CATEGORIES_SUCCESS: "@@hub/GET_HUB_CATEGORIES_SUCCESS",
  GET_HUB_CATEGORIES_FAILURE: "@@hub/GET_HUB_CATEGORIES_FAILURE",
  GET_HUBS_SUCCESS: "@@hub/GET_HUBS_SUCCESS",
  GET_HUBS_FAILURE: "@@hub/GET_HUBS_FAILURE",
  UPDATE_HUB: "@@hub/UPDATE_HUB",
  GET_TOP_HUBS_SUCCESS: "@@hub/GET_TOP_HUBS_SUCCESS",
  UPDATE_SUBSCRIBED_HUBS: "@@hub/UPDATE_SUBSCRIBED_HUBS",
  UPDATE_TOP_HUBS: "@@hub/UPDATE_TOP_HUBS",
  REMOVE_HUB: "@@hub/REMOVE_HUB",
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
  getCategories: () => {
    return (dispatch) => {
      return fetch(API.GET_HUB_CATEGORIES(), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          const categories = [...resp.results];
          categories.sort((a, b) =>
            a.category_name.localeCompare(b.category_name)
          );
          categories.unshift({ id: 0.5, category_name: "Trending" });

          return dispatch({
            type: HubConstants.GET_HUB_CATEGORIES_SUCCESS,
            payload: {
              categories,
            },
          });
        })
        .catch((err) => {
          return dispatch({
            type: HubConstants.GET_HUB_CATEGORIES_FAILURE,
            payload: {
              categories: [],
            },
          });
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
          let hubsByCategory = shims.categorizeHubs([...hubs]);
          let hubsByAlpha = shims.sortHubs([...hubs]);
          return dispatch({
            type: HubConstants.GET_HUBS_SUCCESS,
            payload: {
              hubs,
              hubsByCategory,
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
    return (dispatch) => {
      return fetch(API.SORTED_HUB({}), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          let topHubs = [...resp.results];
          if (!auth || !auth.isLoggedIn) {
            topHubs = topHubs.map((hub) => {
              hub.user_is_subscribed = false;
              return hub;
            });
          }
          return dispatch({
            type: HubConstants.GET_TOP_HUBS_SUCCESS,
            payload: {
              topHubs: topHubs,
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
    return (dispatch, getState) => {
      let { topHubs, subscribedHubs, hubs } = getState().hubs;

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
  removeHub: (hubId) => {
    return (dispatch, getState) => {
      const { hubs, topHubs } = getState().hubs;

      let updatedHubs = hubs.filter((hub) => hub.id !== hubId);
      let updatedTopHubs = topHubs.filter((hub) => hub.id !== hubId);

      return dispatch({
        type: HubConstants.REMOVE_HUB,
        payload: {
          topHubs: updatedTopHubs,
          hubs: updatedHubs,
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
  categories: [],
  hubs: [],
  topHubs: [],
  hubsByCategory: {},
  hubsByAlpha: {},
  fetchedHubs: false,
  subscribedHubs: [],
};

const HubReducer = (state = defaultHubState, action) => {
  switch (action.type) {
    case HubConstants.UPDATE_CURRENT_HUB_PAGE:
    case HubConstants.GET_HUB_CATEGORIES_SUCCESS:
    case HubConstants.GET_HUBS_SUCCESS:
    case HubConstants.GET_HUBS_FAILURE:
    case HubConstants.UPDATE_HUB:
    case HubConstants.GET_TOP_HUBS_SUCCESS:
    case HubConstants.UPDATE_SUBSCRIBED_HUBS:
    case HubConstants.UPDATE_TOP_HUBS:
    case HubConstants.REMOVE_HUB:
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
  categorizeHubs: (allHubs) => {
    let categorizedHubs = {};
    allHubs.forEach((hub) => {
      const category_id = hub.category;
      if (categorizedHubs[category_id]) {
        categorizedHubs[category_id].push(hub);
      } else {
        categorizedHubs[category_id] = [hub];
      }
    });
    return categorizedHubs;
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
