import API from "~/config/api";
import { Helpers } from "~/config/helpers";
import { doesNotExist } from "~/config/utils";
import { handleCatch } from "~/redux/utils";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const LimitationsConstants = {
  FETCH_LIMITATIONS: "@@LIMITATIONS/FETCH_LIMITATIONS",
  FETCH_SUCCESS: "@@LIMITATIONS/FETCH_SUCCESS",
  FETCH_FAILURE: "@@LIMITATIONS/FETCH_FAILURE",
  POST_LIMITATION: "@@LIMITATIONS/POST_LIMITATION",
  POST_SUCCESS: "@@LIMITATIONS/POST_SUCCESS",
  POST_FAILURE: "@@LIMITATIONS/POST_FAILURE",
  REORDER_LIMITATIONS: "@@LIMITATIONS/REORDER_LIMITATIONS",
  REORDER_SUCCESS: "@@LIMITATIONS/REORDER_SUCCESS",
  REORDER_FAILURE: "@@LIMITATIONS/REORDER_FAILURE",
};

const BULLET_COUNT = 5;

export const LimitationsActions = {
  getLimitations: (paperId) => {
    return (dispatch) => {
      dispatch({
        type: LimitationsConstants.FETCH_LIMITATIONS,
        payload: { pending: true, success: false },
      });
      return fetch(
        API.BULLET_POINT({
          paperId,
          ordinal__isnull: false,
          type: "LIMITATION",
        }),
        API.GET_CONFIG()
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          return dispatch({
            type: LimitationsConstants.FETCH_SUCCESS,
            payload: {
              limits: res.results,
              pending: false,
              success: true,
            },
          });
        })
        .catch((err) => {
          return dispatch({
            type: LimitationsConstants.FETCH_FAILURE,
            payload: {
              pending: false,
              success: false,
            },
          });
        });
    };
  },
  postLimitation: ({ paperId, limitation, prevState, progress }) => {
    return (dispatch) => {
      dispatch({
        type: LimitationsConstants.POST_LIMITATION,
        payload: { pending: true, success: false },
      });
      return fetch(
        API.BULLET_POINT({ paperId, progress }),
        API.POST_CONFIG(limitation)
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let newLimitation = res;
          let limits = [...prevState.limits, res];

          return dispatch({
            type: LimitationsConstants.POST_SUCCESS,
            payload: {
              limits,
              newLimitation,
              pending: false,
              success: true,
            },
          });
        })
        .catch((err) => {
          if (err.response.status === 429) {
            handleCatch(err, dispatch);
            return dispatch({
              type: LimitationsConstants.POST_FAILURE,
              payload: {
                pending: false,
                success: false,
                status: 429,
              },
            });
          }
          return dispatch({
            type: LimitationsConstants.POST_FAILURE,
            payload: {
              pending: false,
              success: false,
              status: err.response.status,
            },
          });
        });
    };
  },
  reorderLimitations: ({ limits, paperId }) => {
    return (dispatch) => {
      dispatch({
        type: LimitationsConstants.REORDER_LIMITATIONS,
        payload: { pending: true, success: false },
      });
      let order = [];
      for (let i = 0; i < limits.length; i++) {
        order.push(limits[i].id);
      }

      let params = {
        order,
        bullet_type: "LIMITATION",
      };

      return fetch(API.REORDER_BULLETS(), API.PATCH_CONFIG(params))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          return dispatch({
            type: LimitationsConstants.REORDER_SUCCESS,
            payload: {
              limits,
              pending: false,
              success: true,
            },
          });
        })
        .catch((err) => {
          if (err.response.status === 429) {
            handleCatch(err, dispatch);
          }
          return dispatch({
            type: LimitationsConstants.REORDER_FAILURE,
            payload: {
              pending: false,
              success: false,
              status: err.response.status,
            },
          });
        });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultLimitationsState = {
  limits: [],
  newLimitation: null,
};

const LimitationsReducer = (state = defaultLimitationsState, action) => {
  switch (action.type) {
    case LimitationsConstants.FETCH_LIMITATIONS:
    case LimitationsConstants.FETCH_FAILURE:
    case LimitationsConstants.FETCH_SUCCESS:
    case LimitationsConstants.POST_LIMITATION:
    case LimitationsConstants.POST_SUCCESS:
    case LimitationsConstants.POST_FAILURE:
    case LimitationsConstants.REORDER_LIMITATIONS:
    case LimitationsConstants.REORDER_SUCCESS:
    case LimitationsConstants.REORDER_FAILURE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default LimitationsReducer;
