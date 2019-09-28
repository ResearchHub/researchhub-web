import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const PaperConstants = {
  GET_PAPER: "@@paper/GET_PAPER",
};

export const PaperActions = {
  getPaper: (paperId) => {
    return (dispatch) => {
      return fetch(API.PAPER({ paperId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          return dispatch({
            type: PaperConstants.GET_PAPER,
            payload: { ...resp, doneFetching: true },
          });
        });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultPaperState = {
  authors: [],
};

const PaperReducer = (state = defaultPaperState, action) => {
  switch (action.type) {
    case PaperConstants.GET_PAPER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default PaperReducer;
