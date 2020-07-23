import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import * as shims from "./shims";
import * as types from "./types";
import * as actions from "./actions";
import * as utils from "../utils";
import * as Sentry from "@sentry/browser";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const PaperActions = {
  postUpvote: (paperId) => {
    const isUpvote = true;

    return async (dispatch) => {
      await fetch(API.UPVOTE(paperId), API.POST_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const vote = shims.vote(res);
          let action = actions.setUserVoteSuccess(vote);

          return dispatch(action);
        })
        .catch((err) => {
          utils.logFetchError(err);
          utils.handleCatch(err);
          let action = actions.setUserVoteFailure(isUpvote);
          return dispatch(action);
        });
    };
  },

  postDownvote: (paperId) => {
    const isUpvote = false;

    return async (dispatch) => {
      await fetch(API.DOWNVOTE(paperId), API.POST_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const vote = shims.vote(res);
          let action = actions.setUserVoteSuccess(vote);
          return dispatch(action);
        })
        .catch((err) => {
          utils.handleCatch(err);
          let action = actions.setUserVoteFailure(isUpvote);
          return dispatch(action);
        });
    };
  },
  getPaper: (paperId) => {
    return (dispatch) => {
      dispatch({
        type: types.GET_PAPER,
        payload: {
          doneFetchingPaper: false,
        },
      });
      return fetch(API.PAPER({ paperId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          return dispatch({
            type: types.GET_PAPER,
            payload: {
              ...shims.paper(resp),
              doneFetchingPaper: true,
              status: resp.status,
            },
          });
        })
        .catch((error) => {
          Sentry.captureException(error);
          return dispatch({
            type: types.GET_PAPER,
            payload: {
              status: error.response.status,
            },
          });
        });
    };
  },
  getThreads: ({ paperId, paper, filter, page, twitter, loadMore = false }) => {
    if (paper === null || paper === undefined) {
      return;
    }

    return (dispatch) => {
      let endpoint = loadMore
        ? paper.discussion.next
        : API.DISCUSSION({ paperId, filter, page, progress: false, twitter });
      return fetch(endpoint, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const updatedPaper = { ...paper };
          let { discussion } = updatedPaper;
          let source = twitter ? "twitter" : "researchhub";

          // reset the list from page 1 when filter is changed; initial set state
          if (
            discussion.source !== source ||
            discussion.filter !== filter ||
            page === 1
          ) {
            discussion.filter = filter ? filter : "-score"; // set filter
            discussion.count = res.count; // set count
            discussion.threads = [...res.results]; // set threads
            discussion.next = res.next;
            discussion.source = source;
          } else {
            // additional pages are appended to list
            discussion.threads = [
              ...discussion.threads,
              ...shims.transformThreads(res.results),
            ];
            discussion.next = res.next;
          }

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
  patchPaper: (paperId, body, progress) => {
    return async (dispatch) => {
      const response = await fetch(
        API.PAPER({ paperId, progress }),
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
  uploadPaperToState: (paperFile, paperMeta) => {
    let payload = {
      uploadedPaper: paperFile,
    };
    if (paperMeta) {
      payload.uploadedPaperMeta = paperMeta;
    }
    return (dispatch) => {
      return dispatch({
        type: types.UPLOAD_PAPER_TO_STATE,
        payload,
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
          uploadedPaperMeta: {},
        },
      });
    };
  },
  updatePaperState: (key, value) => {
    return (dispatch) => {
      return dispatch({
        type: types.UPDATE_PAPER_STATE,
        payload: {
          [key]: value,
        },
      });
    };
  },
};
