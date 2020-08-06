import API from "~/config/api";
import { Helpers } from "~/config/helpers";
import { handleCatch } from "~/redux/utils";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const FlagConstants = {
  POST_FLAG_PENDING: "@@Flag/POST_FLAG_PENDING",
  POST_FLAG_SUCCESS: "@@Flag/POST_FLAG_SUCCESS",
  POST_FLAG_FAILURE: "@@Flag/POST_FLAG_FAILURE",
  REMOVE_FLAG_PENDING: "@@Flag/REMOVE_FLAG_PENDING",
  REMOVE_FLAG_SUCCESS: "@@Flag/REMOVE_FLAG_SUCCESS",
  REMOVE_FLAG_FAILURE: "@@Flag/REMOVE_FLAG_FAILURE",
  CHECK_PAPER_FOR_FLAG: "@@Flag/CHECK_PAPER_FOR_FLAG",
};

export const FlagActions = {
  checkPaperForFlag: (prevState, paper) => {
    return (dispatch) => {
      let flaggedPapers = { ...prevState };

      if (paper.user_flag) {
        flaggedPapers[paper.id] = true;
      } else {
        if (flaggedPapers[paper.id]) {
          delete flaggedPapers[paper.id];
        }
      }
      return dispatch({
        type: FlagConstants.CHECK_PAPER_FOR_FLAG,
        payload: {
          flaggedPapers,
        },
      });
    };
  },
  postPaperFlag: (prevState, paperId, reason = "copyright") => {
    return (dispatch) => {
      dispatch({
        type: FlagConstants.POST_FLAG_PENDING,
        payload: {
          doneFetching: false,
        },
      });
      return fetch(API.FLAG_PAPER({ paperId }), API.POST_CONFIG({ reason }))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const flaggedPapers = { ...prevState };
          flaggedPapers[paperId] = true;

          return dispatch({
            type: FlagConstants.POST_FLAG_SUCCESS,
            payload: {
              flaggedPapers,
              doneFetching: true,
              success: true,
            },
          });
        })
        .catch((err) => {
          if (err.response.status === 429) {
            handleCatch(err, dispatch);
          }
          return dispatch({
            type: FlagConstants.POST_FLAG_FAILURE,
            payload: {
              doneFetching: true,
              success: false,
            },
          });
        });
    };
  },
  removePaperFlag: (prevState, paperId) => {
    return (dispatch) => {
      // dispatch({
      //   type: FlagConstants.REMOVE_FLAG_PENDING,
      //   payload: {
      //     doneFetching: false,
      //   },
      // });
      return fetch(API.FLAG_PAPER({ paperId }), API.DELETE_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const flaggedPapers = { ...prevState };

          if (flaggedPapers[paperId]) {
            delete flaggedPapers[paperId];
          }

          return dispatch({
            type: FlagConstants.REMOVE_FLAG_SUCCESS,
            action: {
              flaggedPapers,
              doneFetching: true,
              success: true,
            },
          });
        })
        .catch((err) => {
          if (err.response.status === 429) {
            handleCatch(err, dispatch);
          }
          return dispatch({
            type: FlagConstants.REMOVE_FLAG_FAILURE,
            payload: {
              doneFetching: true,
              success: false,
            },
          });
        });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultFlagState = {
  flaggedPapers: {},
};

const FlagReducer = (state = defaultFlagState, action) => {
  switch (action.type) {
    case FlagConstants.POST_FLAG_SUCCESS:
    case FlagConstants.POST_FLAG_FAILURE:
    case FlagConstants.POST_FLAG_PENDING:
    case FlagConstants.REMOVE_FLAG_PENDING:
    case FlagConstants.REMOVE_FLAG_FAILURE:
    case FlagConstants.REMOVE_FLAG_SUCCESS:
    case FlagConstants.CHECK_PAPER_FOR_FLAG:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default FlagReducer;
