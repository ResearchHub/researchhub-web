import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AuthConstants } from "./auth";
import { handleCatch } from "~/redux/utils";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const BannerConstants = {
  DETERMINE_BANNER: "@@banner/DETERMINE_BANNER",
  REMOVE_BANNER: "@@banner/REMOVE_BANNER",
};

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const reportBanner = (params) => {
  return fetch(API.ANALYTICS_WEBSITEVIEWS({}), API.POST_CONFIG(params))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .catch((err) => {
      handleCatch(err, params.dispatch);
    });
};

export const BannerActions = {
  determineBanner: () => {
    return (dispatch) => {
      if (!process.browser) return;

      let coinFlip = Math.random() >= 0.5; // 50% chance
      let uuid = localStorage.getItem("researchhub.uuid");
      if (!uuid) {
        uuid = uuidv4();
        localStorage.setItem("researchhub.uuid", uuid);
      }

      dispatch({
        type: AuthConstants.UPDATE_USER_PROFILE,
        user: {
          uuid,
        },
      });

      let pref = localStorage.getItem("researchhub.signup.banner");
      if (pref === "true") {
        return dispatch({
          type: BannerConstants.DETERMINE_BANNER,
          payload: {
            showSignupBanner: true,
          },
        });
      } else if (pref === "false") {
        return dispatch({
          type: BannerConstants.DETERMINE_BANNER,
          payload: {
            showSignupBanner: false,
          },
        });
      } else if (pref === null || pref === undefined) {
        localStorage.setItem("researchhub.signup.banner", coinFlip);
        reportBanner({ uuid, saw_signup_banner: coinFlip, dispatch });
        return dispatch({
          type: BannerConstants.DETERMINE_BANNER,
          payload: {
            showSignupBanner: coinFlip,
          },
        });
      }
    };
  },
  removeBanner: () => {
    return (dispatch) => {
      localStorage.setItem("researchhub.signup.banner", false);

      return dispatch({
        type: BannerConstants.REMOVE_BANNER,
        payload: {
          showSignupBanner: false,
        },
      });
    };
  },
};

/**********************************
 *        REDUCER SECTION         *
 **********************************/

const defaultBannerState = {
  showSignupBanner: false,
};

const BannerReducer = (state = defaultBannerState, action) => {
  switch (action.type) {
    case BannerConstants.DETERMINE_BANNER:
    case BannerConstants.REMOVE_BANNER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default BannerReducer;
