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

  postPaper: (body) => {
    return async (dispatch) => {
      const response = await fetch(
        API.POST_PAPER(),
        API.POST_FILE_CONFIG(shims.paperPost(body))
      ).catch(utils.handleCatch);

      return utils.dispatchResult(
        response,
        dispatch,
        actions.setPostPaperFailure(),
        actions.setPostPaperSuccess()
      );
    };
  },

  postPaperSummary: (body) => {
    return async (dispatch) => {
      const response = await fetch(
        API.PAPER(),
        API.POST_CONFIG(shims.paperSummaryPost(body))
      ).catch(utils.handleCatch);

      return utils.dispatchResult(
        response,
        dispatch,
        actions.setPostPaperSummaryFailure(),
        actions.setPostPaperSummarySuccess()
      );
    };
  },

  /**
   * saves the paper to redux state (not backend)
   */
  uploadPaperToState: (paperFile) => {
    return (dispatch) => {
      return dispatch({
        type: types.UPLOAD_PAPER_TO_STATE,
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
        type: types.REMOVE_PAPER_FROM_STATE,
        payload: {
          uploadedPaper: {},
        },
      });
    };
  },
};
