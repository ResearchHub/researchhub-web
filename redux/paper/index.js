import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import * as shims from "./shims";
import * as types from "./types";
import * as actions from "./actions";
import * as Sentry from "@sentry/browser";
import { sendAmpEvent } from "~/config/fetch";
import { handleCatch } from "../utils";
import { logFetchError } from "~/config/utils/misc";
/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const PaperActions = {
  postUpvote: (paperId) => {
    const isUpvote = true;

    return async (dispatch, getState) => {
      await fetch(API.UPVOTE("paper", paperId), API.POST_CONFIG())
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
          logFetchError(err);
          handleCatch(err, dispatch);
          let action = actions.setUserVoteFailure(isUpvote);
          return dispatch(action);
        });
    };
  },

  postDownvote: (paperId) => {
    const isUpvote = false;

    return async (dispatch, getState) => {
      await fetch(API.DOWNVOTE("paper", paperId), API.POST_CONFIG())
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
          handleCatch(err, dispatch);
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
    const documentId = paperId;
    const documentType = "paper";

    return (dispatch, getState) => {
      let endpoint = loadMore
        ? paper.nextDiscussion
        : API.DISCUSSION({
            documentId,
            documentType,
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
  getPostThreads: ({
    documentId,
    post,
    filter,
    twitter,
    page,
    loadMore = false,
  }) => {
    if (post === null || post === undefined) {
      return;
    }
    const documentType = "post";

    return (dispatch, getState) => {
      let endpoint = loadMore
        ? post.nextDiscussion
        : API.DISCUSSION({
            documentId,
            documentType,
            filter,
            page: 1,
            progress: false,
            twitter,
          });
      return fetch(endpoint, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const currPost = getState().post;

          let threads = [...res.results];
          if (loadMore) {
            threads = [...currPost.threads, ...res.results];
          }

          return dispatch({
            type: types.GET_THREADS,
            payload: {
              threads: threads,
              threadCount: res.count,
              nextDiscussion: res.next,
            },
          });
        });
    };
  },
  getHypothesisThreads: ({
    documentId,
    hypothesis,
    filter,
    twitter,
    page,
    loadMore = false,
  }) => {
    if (hypothesis === null || hypothesis === undefined) {
      return;
    }
    const documentType = "hypothesis";

    return (dispatch, getState) => {
      let endpoint = loadMore
        ? hypothesis.nextDiscussion
        : API.DISCUSSION({
            documentId,
            documentType,
            filter,
            page: 1,
            progress: false,
            twitter,
          });
      return fetch(endpoint, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const currHypothesis = getState().hypothesis;

          let threads = [...res.results];
          if (loadMore) {
            threads = [...currPost.threads, ...res.results];
          }

          return dispatch({
            type: types.GET_THREADS,
            payload: {
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
      ).catch(handleCatch);

      let action = actions.setUserVoteFailure();

      if (!response.ok) {
        const body = await response.json();
        const vote = shims.vote(body);
        action = actions.setUserVoteSuccess(vote);
      } else {
        logFetchError(response);
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
      ).catch(handleCatch);

      let errorBody = null;
      if (response.status === 400 || response.status === 500) {
        errorBody = await response.json();
        errorBody.status = response.status;
      }

      if (response.status === 429) {
        let err = { response: {} };
        err.response.status = 429;
        handleCatch(err, dispatch);
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
        logFetchError(response);
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

  resetPaperState: () => {
    return async (dispatch) => {
      return dispatch({
        type: types.RESET_PAPER_STATE,
      });
    };
  },

  postPaperSummary: (body) => {
    return async (dispatch, getState) => {
      const response = await fetch(
        API.PAPER(),
        API.POST_CONFIG(shims.paperSummaryPost(body))
      ).catch(handleCatch);

      let action = actions.setPostPaperSummaryFailure();

      if (response.status === 429) {
        let err = { response: {} };
        err.response.status = 429;
        handleCatch(err, dispatch);
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
        logFetchError(response);
      }

      return dispatch(action);
    };
  },
  patchPaper: (paperId, body, progress, onError) => {
    return async (dispatch) => {
      const response = await fetch(
        API.PAPER({ paperId, progress }),
        API.PATCH_FILE_CONFIG(shims.paperPost(body))
      ).catch(Boolean(onError) ? onError : handleCatch);
      let errorBody = null;
      if (response.status === 400 || response.status === 500) {
        errorBody = await response.json();
        errorBody.status = response.status;
      }

      if (response.status === 429) {
        let err = { response: {} };
        err.response.status = 429;
        handleCatch(err, dispatch);
        errorBody = await response.json();
        errorBody.status = 429;
      }

      let action = actions.setPostPaperFailure("PATCH", errorBody);

      if (response.ok) {
        const body = await response.json();
        const paper = shims.paper(body);
        action = actions.setPostPaperSuccess(paper, "PATCH");
      } else {
        logFetchError(response);
      }
      return dispatch(action);
    };
  },
  putPaper: (paperId, body) => {
    return async (dispatch) => {
      const response = await fetch(
        API.PAPER({ paperId }),
        API.PUT_FILE_CONFIG(shims.paperPost(body))
      ).catch(handleCatch);

      let errorBody = null;

      if (response.status === 400 || response.status === 500) {
        errorBody = await response.json();
      }

      if (response.status === 429) {
        let err = { response: {} };
        err.response.status = 429;
        handleCatch(err, dispatch);
        errorBody = await response.json();
      }

      let action = actions.setPostPaperFailure("PUT", errorBody);

      if (response.ok) {
        const body = await response.json();
        const paper = shims.paper(body);
        action = actions.setPostPaperSuccess(paper, "PUT");
      } else {
        logFetchError(response);
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
