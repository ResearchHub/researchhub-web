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
  postUpvote: (paperId) => {
    const isUpvote = true;

    return async (dispatch) => {
      const response = await fetch(
        API.UPVOTE(paperId),
        API.POST_CONFIG()
      ).catch(utils.handleCatch);

      let status = await Helpers.checkStatus(response).catch(utils.handleCatch);
      let res = await Helpers.parseJSON(status);

      let action = actions.setUserVoteFailure(isUpvote);

      if (response.ok) {
        const vote = shims.vote(res);
        action = actions.setUserVoteSuccess(vote);
      } else {
        utils.logFetchError(response);
      }

      // return dispatch(action);
    };
  },

  postDownvote: (paperId) => {
    const isUpvote = false;

    return async (dispatch) => {
      const response = await fetch(
        API.DOWNVOTE(paperId),
        API.POST_CONFIG()
      ).catch(utils.handleCatch);

      let status = await Helpers.checkStatus(response).catch(utils.handleCatch);
      let res = await Helpers.parseJSON(status);

      let action = actions.setUserVoteFailure(isUpvote);

      if (response.ok) {
        const vote = shims.vote(res);
        action = actions.setUserVoteSuccess(vote);
      } else {
        utils.logFetchError(response);
      }

      // return dispatch(action);
    };
  },
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
              status: resp.status,
            },
          });
        })
        .catch((error) => {
          console.log(error);
          return dispatch({
            type: types.GET_PAPER,
            payload: {
              status: error.response.status,
            },
          });
        });
    };
  },
  getThreads: (paperId, paper) => {
    return (dispatch) => {
      return fetch(API.DISCUSSION(paperId), API.GET_CONFIG)
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const updatedPaper = { ...paper };
          updatedPaper.discussion.count = res.count;
          updatedPaper.discussion.threads = res.results;

          return dispatch({
            type: types.GET_THREADS,
            payload: {
              ...shims.paper(updatedPaper),
            },
          });
        });
    };
  },
  getUserVote: (paperId) => {
    return async (dispatch) => {
      const response = await fetch(
        API.USER_VOTE(paperId),
        API.GET_CONFIG()
      ).catch(utils.handleCatch);

      let action = actions.setUserVoteFailure();

      if (!response.ok) {
        const body = await response.json();
        const vote = shims.vote(body);
        action = actions.setUserVoteSuccess(vote);
      } else {
        utils.logFetchError(response);
      }
      return dispatch(action);
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
              editHistory: shims.editHistory(resp),
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

  clearPostedPaper: () => {
    return async (dispatch) => {
      return dispatch({
        type: types.CLEAR_POSTED_PAPER,
        payload: {
          postedPaper: {},
        },
      });
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
  patchPaper: (paperId, body) => {
    return async (dispatch) => {
      const response = await fetch(
        API.PAPER({ paperId }),
        API.PATCH_FILE_CONFIG(shims.paperPost(body))
      ).catch(utils.handleCatch);

      let action = actions.setPostPaperFailure("PATCH");
      if (response.ok) {
        const body = await response.json();
        const paper = shims.paper(body);
        action = actions.setPostPaperSuccess(paper, "PATCH");
      } else {
        utils.logFetchError(response);
      }
      return dispatch(action);
    };
  },
  putPaper: (paperId, body) => {
    return async (dispatch) => {
      const response = await fetch(
        API.PAPER({ paperId }),
        API.PUT_FILE_CONFIG(shims.paperPost(body))
      ).catch(utils.handleCatch);

      let action = actions.setPostPaperFailure("PUT");
      if (response.ok) {
        const body = await response.json();
        const paper = shims.paper(body);
        action = actions.setPostPaperSuccess(paper, "PUT");
      } else {
        utils.logFetchError(response);
      }
      return dispatch(action);
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
