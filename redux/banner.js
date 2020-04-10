import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

/**********************************
 *        ACTIONS SECTION         *
 **********************************/

export const BannerConstants = {
  DETERMINE_BANNER: "@@banner/DETERMINE_BANNER",
  REMOVE_BANNER: "@@banner/REMOVE_BANNER",
};

export const BannerActions = {
  determineBanner: () => {
    return (dispatch) => {
      let pref = localStorage.getItem("researchhub.signup.banner");
      if (pref === "false") {
        return dispatch({
          type: BannerConstants.DETERMINE_BANNER,
          payload: {
            showSignupBanner: false,
          },
        });
      } else if (pref === null || pref === undefined) {
        let coinFlip = Math.random() >= 0.5; // 50% chance
        localStorage.setItem("researchhub.signup.banner", coinFlip);
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
