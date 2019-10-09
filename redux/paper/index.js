import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import * as shims from "./shims";
import * as types from "./types";
import * as actions from "./actions";
import * as utils from "../utils";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const PaperActions = {
  getPaper: (paperId) => {
    return (dispatch) => {
      return fetch(API.PAPER({ paperId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          return dispatch({
            type: types.GET_PAPER,
            payload: {
              ...shims.paper(resp),
              doneFetching: true,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };
  },

  getEditHistory: (paperId) => {
    return (dispatch) => {
      return fetch(API.GET_EDITS({ paperId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          return dispatch({
            type: types.GET_EDITS,
            payload: {
              editHistory: resp,
              doneFetching: true,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };
  },

  postPaper: (body) => {
    return async (dispatch) => {
      const response = await fetch(
        API.POST_PAPER(),
        API.POST_FILE_CONFIG(shims.paperPost(body))
      ).catch(utils.handleCatch);

      let action = actions.setPostPaperFailure();
      if (response.ok) {
        const body = await response.json();
        const paper = shims.paper(body);
        action = actions.setPostPaperSuccess(paper);
      } else {
        utils.logFetchError(response);
      }

      return dispatch(action);
    };
  },

  postPaperSummary: (body) => {
    return async (dispatch) => {
      const response = await fetch(
        API.PAPER(),
        API.POST_CONFIG(shims.paperSummaryPost(body))
      ).catch(utils.handleCatch);

      let action = actions.setPostPaperSummaryFailure();

      if (response.ok) {
        action = actions.setPostPaperSummarySuccess();
      } else {
        utils.logFetchError(response);
      }

      return dispatch(action);
    };
  },

  /**
   * saves the paper to redux state (not backend)
   */
  uploadPaperToState: (paperFile, paperTitle) => {
    return (dispatch) => {
      return dispatch({
        type: types.UPLOAD_PAPER_TO_STATE,
        payload: {
          uploadedPaper: paperFile,
          uploadedPaperTitle: paperTitle,
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
        type: types.REMOVE_PAPER_FROM_STATE,
        payload: {
          uploadedPaper: {},
        },
      });
    };
  },
};
