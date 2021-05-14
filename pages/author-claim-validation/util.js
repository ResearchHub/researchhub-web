import { css, StyleSheet } from "aphrodite";
import { VALIDATION_STATE } from "./constants";
import colors from "~/config/themes/colors";
import Loader from "~/components/Loader/Loader";
import React from "react";

export const getPageBody = (validationState) => {
  switch (validationState) {
    case VALIDATION_STATE.DENIED_TOO_MANY_ATTEMPS:
      return (
        <div className={css(styles.pageBody)}>
          <span>
            {
              "Looks like this request was invalidated due to too many attempts. Please make a new request"
            }
          </span>
        </div>
      );
    case VALIDATION_STATE.DENIED_WRONG_USER:
      return (
        <div className={css(styles.pageBody)}>
          <span>
            {
              "Looks like you're logged in as a different account. Please make sure you are logged in with ResearchHub account that you've made this request with."
            }
          </span>
        </div>
      );
    case VALIDATION_STATE.REQUEST_NOT_FOUND:
      return (
        <div className={css(styles.pageBody)}>
          <span>
            {
              "We are unable to find this request. Please make sure to only use link that's provided by the email that ResearchHub sent you"
            }
          </span>
        </div>
      );
    case VALIDATION_STATE.VALIDATED:
      return (
        <div className={css(styles.pageBody)}>
          <div>{"You have successfully authenciated your request"}</div>
          <div>
            {"ResearchHub team will now review your author claim request"}
          </div>
        </div>
      );
    case VALIDATION_STATE.LOADING:
    default:
      return (
        <div className={css(styles.pageBody)}>
          <span className={css(styles.marginRight8)}>
            <Loader color={colors.BLUE(1)} loading size={16} />
          </span>
          <span>{" Please be patient while we authenticate your request"}</span>
        </div>
      );
  }
};

const styles = StyleSheet.create({
  marginRight8: {
    marginRight: 8,
  },
  pageBody: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
    fontSize: 16,
  },
});
