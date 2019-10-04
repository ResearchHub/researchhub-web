import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { paperShim } from "./paper/shims";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const PaperConstants = {
  GET_PAPER: "@@paper/GET_PAPER",
  UPLOAD_PAPER_TO_STATE: "@@paper/SAVE_PAPER_TO_STATE",
  REMOVE_PAPER_FROM_STATE: "@@paper/REMOVE_PAPER_FROM_STATE",
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
            payload: {
              ...paperShim(resp),
              doneFetching: true,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };
  },
  /**
   * saves the paper to redux state (not backend)
   */
  uploadPaperToState: (paperFile) => {
    return (dispatch) => {
      return dispatch({
        type: PaperConstants.UPLOAD_PAPER_TO_STATE,
        payload: {
          uploadedPaper: paperFile,
        },
      });
    };
  },
  /**
   * removes the paper from redux state (not backend)
   */
  removePaperFromState: () => {
    return (dispatch) => {
      return dispatch({
        type: PaperConstants.REMOVE_PAPER_FROM_STATE,
        payload: {
          uploadedPaper: {},
        },
      });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultPaperState = {
  authors: [],
  uploadedPaper: {},
  summary: {},
};

const PaperReducer = (state = defaultPaperState, action) => {
  switch (action.type) {
    case PaperConstants.GET_PAPER:
      return {
        ...state,
        ...action.payload,
      };
    case PaperConstants.UPLOAD_PAPER_TO_STATE:
      return {
        ...state,
        uploadedPaper: action.payload.uploadedPaper,
      };
    case PaperConstants.REMOVE_PAPER_FROM_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default PaperReducer;
