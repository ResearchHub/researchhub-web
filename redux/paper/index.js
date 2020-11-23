import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import * as shims from "./shims";
import * as types from "./types";
import * as actions from "./actions";
import * as utils from "../utils";
import * as Sentry from "@sentry/browser";
import { sendAmpEvent } from "~/config/fetch";
/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const PaperActions = {
  postUpvote: (paperId) => {
    const isUpvote = true;

    return async (dispatch, getState) => {
      await fetch(API.UPVOTE(paperId), API.POST_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const vote = shims.vote(res);
          let action = actions.setUserVoteSuccess(vote);

          let payload = {
            event_type: "create_paper_vote",
            time: +new Date(),
            user_id: getState().auth.user
              ? getState().auth.user.id && getState().auth.user.id
              : null,
            insert_id: `paper_vote_${vote.id}`,
            event_properties: {
              interaction: "Paper Upvote",
            },
          };
          sendAmpEvent(payload);

          return dispatch(action);
        })
        .catch((err) => {
          utils.logFetchError(err);
          utils.handleCatch(err, dispatch);
          let action = actions.setUserVoteFailure(isUpvote);
          return dispatch(action);
        });
    };
  },

  postDownvote: (paperId) => {
    const isUpvote = false;

    return async (dispatch, getState) => {
      await fetch(API.DOWNVOTE(paperId), API.POST_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const vote = shims.vote(res);
          let action = actions.setUserVoteSuccess(vote);

          let payload = {
            event_type: "create_paper_vote",
            time: +new Date(),
            user_id: getState().auth.user
              ? getState().auth.user.id && getState().auth.user.id
              : null,
            insert_id: `paper_vote_${vote.id}`,
            event_properties: {
              interaction: "Paper Downvote",
            },
          };
          sendAmpEvent(payload);

          return dispatch(action);
        })
        .catch((err) => {
          utils.handleCatch(err, dispatch);
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
  getThreads: ({ paperId, paper, filter, twitter, page, loadMore = false }) => {
    if (paper === null || paper === undefined) {
      return;
    }

    return (dispatch, getState) => {
      let endpoint = loadMore
        ? paper.nextDiscussion
        : API.DISCUSSION({
            paperId,
            filter,
            page: 1,
            progress: false,
            twitter,
          });
      return fetch(endpoint, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const currPaper = getState().paper;
          let discussion = { ...currPaper.discussion };
          let source = twitter ? "twitter" : "researchhub";

          let threads = [...res.results];
          discussion.source = source;
          if (loadMore) {
            threads = [...currPaper.threads, ...res.results];
          }

          return dispatch({
            type: types.GET_THREADS,
            payload: {
              discussion: currPaper.discussion,
              threads: threads,
              threadCount: res.count,
              nextDiscussion: res.next,
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

  getEditHistory: (paperId, loadMore = false) => {
    return (dispatch, getState) => {
      const { next, results } = getState().paper.editHistory;
      const ENDPOINT = next ? next : API.GET_EDITS({ paperId });

      return fetch(ENDPOINT, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          let edits = shims.editHistory(resp.results);

          if (loadMore) {
            edits = [...results, ...edits];
          }

          return dispatch({
            type: types.GET_EDITS,
            payload: {
              editHistory: {
                ...resp,
                results: edits,
              },
              doneFetching: true,
            },
          });
        });
    };
  },

  postPaper: (body) => {
    return async (dispatch, getState) => {
      const response = await fetch(
        API.POST_PAPER(),
        API.POST_FILE_CONFIG(shims.paperPost(body))
      ).catch(utils.handleCatch);

      let errorBody = null;
      if (response.status === 400 || response.status === 500) {
        errorBody = await response.json();
        errorBody.status = response.status;
      }

      if (response.status === 429) {
        let err = { response: {} };
        err.response.status = 429;
        utils.handleCatch(err, dispatch);
        errorBody = await response.json();
        errorBody.status = 429;
      }

      let action = actions.setPostPaperFailure("POST", errorBody);

      if (response.ok) {
        const body = await response.json();
        const paper = shims.paper(body);

        let payload = {
          event_type: "create_paper",
          time: +new Date(),
          user_id: getState().auth.user
            ? getState().auth.user.id && getState().auth.user.id
            : null,
          insert_id: `paper_${paper.id}`,
          event_properties: {
            interaction: "Create Paper",
            is_removed: paper.is_removed,
          },
        };

        sendAmpEvent(payload);
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
    return async (dispatch, getState) => {
      const response = await fetch(
        API.PAPER(),
        API.POST_CONFIG(shims.paperSummaryPost(body))
      ).catch(utils.handleCatch);

      let action = actions.setPostPaperSummaryFailure();

      if (response.status === 429) {
        let err = { response: {} };
        err.response.status = 429;
        utils.handleCatch(err, dispatch);
        return dispatch(action);
      }

      if (response.ok) {
        let payload = {
          event_type: "create_summary",
          time: +new Date(),
          user_id: getState().auth.user
            ? getState().auth.user.id && getState().auth.user.id
            : null,
          insert_id: `summary_${response.id}`,
          event_properties: {
            paper: body.paperId,
            interaction: "Paper Summary",
          },
        };
        sendAmpEvent(payload);

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

      let errorBody = null;
      if (response.status === 400 || response.status === 500) {
        errorBody = await response.json();
        errorBody.status = response.status;
      }

      if (response.status === 429) {
        let err = { response: {} };
        err.response.status = 429;
        utils.handleCatch(err, dispatch);
        errorBody = await response.json();
        errorBody.status = 429;
      }

      let action = actions.setPostPaperFailure("PATCH", errorBody);

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

      let errorBody = null;

      if (response.status === 400 || response.status === 500) {
        errorBody = await response.json();
      }

      if (response.status === 429) {
        let err = { response: {} };
        err.response.status = 429;
        utils.handleCatch(err, dispatch);
        errorBody = await response.json();
      }

      let action = actions.setPostPaperFailure("PUT", errorBody);

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
