import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { doesNotExist } from "~/config/utils";
/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const BulletsConstants = {
  FETCH_BULLETS: "@@BULLETS/FETCH_BULLETS",
  FETCH_SUCCESS: "@@BULLETS/FETCH_SUCCESS",
  FETCH_FAILURE: "@@BULLETS/FETCH_FAILURE",
  POST_BULLET: "@@BULLETS/POST_BULLET",
  POST_SUCCESS: "@@BULLETS/POST_SUCCESS",
  POST_FAILURE: "@@BULLETS/POST_FAILURE",
};

export const BulletActions = {
  getBullets: (paperId) => {
    return (dispatch) => {
      dispatch({
        type: BulletsConstants.FETCH_BULLETS,
        payload: { pending: true, success: false },
      });
      return fetch(API.BULLET_POINT({ paperId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          return dispatch({
            type: BulletsConstants.FETCH_SUCCESS,
            payload: {
              bullets: res.results,
              pending: false,
              succsss: true,
            },
          });
        })
        .catch((err) => {
          return dispatch({
            type: BulletsConstants.FETCH_FAILURE,
            payload: {
              pending: false,
              sucess: false,
            },
          });
        });
    };
  },
  postBullet: ({ paperId, bullet, prevState }) => {
    return (dispatch) => {
      dispatch({
        type: BulletsConstants.POST_BULLET,
        payload: { pending: true, success: false },
      });
      return fetch(API.BULLET_POINT({ paperId }), API.POST_CONFIG(bullet))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          let newBullet = res;
          let bullets = [...prevState.bullets, ...res];

          return dispatch({
            type: BulletsConstants.POST_SUCCESS,
            payload: {
              bullets,
              newBullet,
              pending: false,
              succsss: true,
            },
          });
        })
        .catch((err) => {
          return dispatch({
            type: BulletsConstants.POST_FAILURE,
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

const defaultBulletsState = {
  bullets: [],
  allBullets: [],
  newBullet: null,
};

const BulletsReducer = (state = defaultBulletsState, action) => {
  switch (action.type) {
    case BulletsConstants.FETCH_BULLETS:
    case BulletsConstants.FETCH_FAILURE:
    case BulletsConstants.FETCH_SUCCESS:
    case BulletsConstants.POST_BULLET:
    case BulletsConstants.POST_SUCCESS:
    case BulletsConstants.POST_FAILURE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default BulletsReducer;
