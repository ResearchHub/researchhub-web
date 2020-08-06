import API from "~/config/api";
import { Helpers } from "~/config/helpers";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const UniversityConstants = {
  GET_UNIVERSITIES: "@@Unviersity/GET_UNIVERSITIES",
};

export const UniversityActions = {
  getUniversities: (search) => {
    return (dispatch) => {
      fetch(API.UNIVERSITY({ search }), API.GET_CONFIG)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let options = res.results.map((uni) => {
            return {
              value: uni.id,
              label: uni.name,
            };
          });
          return dispatch({
            type: UniversityConstants.GET_UNIVERSITIES,
            payload: {
              universities: [...res.results],
              options,
            },
          });
        });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultState = {
  universities: [],
  options: [],
};

const UniversityReducer = (state = defaultState, action) => {
  switch (action.type) {
    case UniversityConstants.GET_UNIVERSITIES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default UniversityReducer;
