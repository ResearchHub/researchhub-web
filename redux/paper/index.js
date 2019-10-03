import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import * as shims from "./shims";
import * as types from "./types";
import * as actions from "./actions";

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
        API.PAPER(),
        API.POST_CONFIG(shims.paperPost(body))
      ).catch(handleCatch);

      return dispatchResult(
        response,
        dispatch(actions.setPostPaperFailure()),
        dispatch(actions.setPostPaperSuccess())
      );
    };
  },

  postPaperSummary: (body) => {
    return async (dispatch) => {
      const response = await fetch(
        API.PAPER(),
        API.POST_CONFIG(shims.paperSummaryPost(body))
      ).catch(handleCatch);

      return dispatchResult(
        response,
        dispatch(actions.setPostPaperSummaryFailure()),
        dispatch(actions.setPostPaperSummarySuccess())
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

function handleCatch(err) {
  console.log(FETCH_ERROR_MESSAGE, err);
  return err;
}

function dispatchResult(response, failure, success) {
  if (!response.ok) {
    logFetchError(response);
    return failure;
  } else {
    return success;
  }
}
