import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { doesNotExist } from "~/config/utils";
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
          console.log("res", res);
          return dispatch({
            type: LimitationsConstants.FETCH_SUCCESS,
            payload: {
              limitations: res.results,
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
  postLimitation: ({ paperId, limitation, prevState }) => {
    console.log("limitation", limitation);
    return (dispatch) => {
      dispatch({
        type: LimitationsConstants.POST_LIMITATION,
        payload: { pending: true, success: false },
      });
      return fetch(API.BULLET_POINT({ paperId }), API.POST_CONFIG(limitation))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          console.log("res", res);
          let newLimitation = res;
          let limitations = [...prevState.limitations, res];

          return dispatch({
            type: LimitationsConstants.POST_SUCCESS,
            payload: {
              limitations,
              newBullet,
              pending: false,
              success: true,
            },
          });
        })
        .catch((err) => {
          console.log("err", err);
          return dispatch({
            type: LimitationsConstants.POST_FAILURE,
            payload: {
              pending: false,
              success: false,
            },
          });
        });
    };
  },
  reorderLimitations: ({ limitations, paperId }) => {
    return (dispatch) => {
      dispatch({
        type: LimitationsConstants.REORDER_LIMITATIONS,
        payload: { pending: true, success: false },
      });
      let order = [];
      for (let i = 0; i < limitations.length; i++) {
        order.push(limitations[i].id);
      }
      return fetch(API.REORDER_BULLETS(), API.PATCH_CONFIG({ order }))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          return dispatch({
            type: LimitationsConstants.REORDER_SUCCESS,
            payload: {
              limitations,
              pending: false,
              success: true,
            },
          });
        })
        .catch((err) => {
          return dispatch({
            type: LimitationsConstants.REORDER_FAILURE,
            payload: {
              pending: false,
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
