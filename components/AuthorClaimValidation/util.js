import { css, StyleSheet } from "aphrodite";
import { VALIDATION_STATE } from "./constants";
import colors from "~/config/themes/colors";
import Loader from "~/components/Loader/Loader";

export const getPageBody = (validationState) => {
  switch (validationState) {
    case VALIDATION_STATE.DENIED_TOO_MANY_ATTEMPS:
      return (
        <div className={css(styles.pageBody)}>
          <div className={css(styles.textRow)}>
            {
              "Looks like this request was invalidated due to too many attempts."
            }
          </div>
          <div className={css(styles.textRow)}>
            {"Please make a new request"}
          </div>
        </div>
      );
    case VALIDATION_STATE.DENIED_WRONG_USER:
      return (
        <div className={css(styles.pageBody)}>
          <div className={css(styles.textRow)}>
            {"Looks like you're logged in as a different account."}
          </div>
          <div className={css(styles.textRow)}>
            {
              "Please make sure you are logged in with ResearchHub account that you've made this request with."
            }
          </div>
        </div>
      );
    case VALIDATION_STATE.REQUEST_NOT_FOUND:
      return (
        <div className={css(styles.pageBody)}>
          <div className={css(styles.textRow)}>
            {"We are unable to find this request."}
          </div>
          <div className={css(styles.textRow)}>
            {
              "Please make sure to only use links that are provided by ResearchHub."
            }
          </div>
        </div>
      );
    case VALIDATION_STATE.VALIDATED:
      return (
        <div className={css(styles.pageBody)}>
          <img
            src={"/static/icons/success2.png"}
            className={css(styles.successImg)}
            draggable={false}
          />
          <div className={css(styles.textRow)}>
            {"You have successfully authenticated your email address!"}
          </div>
          <div className={css(styles.textRow)}>
            {"We will now review your author claim request."}
          </div>
        </div>
      );
    case VALIDATION_STATE.LOADING:
    default:
      return (
        <div className={css(styles.pageBody)}>
          <div className={css(styles.textRow)}>
            <span className={css(styles.marginRight8)}>
              <Loader color={colors.BLUE(1)} loading size={16} />
            </span>
            <span>
              {" Please be patient while we authenticate your request."}
            </span>
          </div>
        </div>
      );
  }
};

const styles = StyleSheet.create({
  marginRight8: {
    marginRight: 8,
  },
  successImg: {
    marginBottom: 25,
  },
  pageBody: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingTop: 24,
    width: "100%",
  },
  textRow: {
    display: "flex",
    fontSize: 20,
    height: 32,
    marginBottom: 4,
  },
});
