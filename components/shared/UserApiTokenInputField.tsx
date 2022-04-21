import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import API from "~/config/api";
import colors from "~/config/themes/colors";
import FormInput from "../Form/FormInput";
import icons from "~/config/themes/icons";
import Loader from "../Loader/Loader";
import Ripples from "react-ripples";
import { captureEvent } from "@sentry/nextjs";

function useEffectGetUserApiToken({
  isLoggedIn,
  tokenName,
  setApiToken,
  setIsLoading,
}: {
  isLoggedIn: boolean;
  tokenName?: string;
  setApiToken: (token: any) => void;
  setIsLoading: (flag: boolean) => void;
}): void {
  useEffect((): void => {
    setIsLoading(true);
    if (isLoggedIn) {
      fetch(API.USER_EXTERNAL_API_TOKEN, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((payload: any): void => {
          setApiToken(payload?.results[0]);
          setIsLoading(false);
        })
        .catch((error: Error) => {
          setIsLoading(false);
          captureEvent(error);
        });
    }
  }, [isLoggedIn]);
}

function UserApiTokenInputField({
  user,
}: {
  user: any /* redux*/;
}): ReactElement<"div"> {
  const isLoggedIn = !isNullOrUndefined(user?.id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiToken, setApiToken] = useState<any>({});

  useEffectGetUserApiToken({ isLoggedIn, setApiToken, setIsLoading });

  const { token, prefix } = apiToken ?? {};
  const userHasApiToken = !isLoading && (!isEmpty(token) || !isEmpty(prefix));

  const handleSubmit = (event: SyntheticEvent): void => {
    event?.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    fetch(
      userHasApiToken
        ? API.USER_EXTERNAL_API_TOKEN_DELETE
        : API.USER_EXTERNAL_API_TOKEN,
      userHasApiToken ? API.DELETE_CONFIG() : API.POST_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((payload: any): void => {
        setApiToken(payload);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        setIsLoading(false);
        captureEvent(error);
      });
  };

  const displayableValue = userHasApiToken
    ? !isEmpty(token)
      ? token
      : `Begins with: ${prefix}`
    : "";

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.labelContainer)}>
        <div className={css(styles.listLabel)} id={"apiTokenField"}>
          {"API Token"}
        </div>
      </div>
      <div className={css(styles.inputFieldContainer)}>
        <form className={css(styles.formContainer)}>
          <FormInput
            containerStyle={styles.inputStyles}
            disabled
            inputStyle={styles.input}
            placeholder={
              isLoading
                ? "Getting Api token ..."
                : "Click the plus button to create a token"
            }
            value={displayableValue}
          />
          <Ripples
            className={css(styles.saveIcon)}
            role="button"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Loader size={12} color={colors.TOOLTIP_TEXT_COLOR_WHITE} />
            ) : userHasApiToken ? (
              icons.times
            ) : (
              icons.plusCircle
            )}
          </Ripples>
        </form>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: "30px 10px",
    borderTop: "1px solid #EDEDED",
  },
  labelContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listLabel: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 15,
    letterSpacing: 1.2,
    marginBottom: 15,
    textAlign: "left",
    color: colors.BLACK(),
    boxSizing: "border-box",
  },
  formSelectContainer: {
    padding: 0,
    margin: 0,
    width: "100%",
    minHeight: "unset",
  },
  formSelectInput: {
    width: "100%",
  },
  multiTagStyle: {
    margin: "5px 0",
    marginRight: 5,
    border: "1px solid #fff",
    padding: "5px 8px",
    ":hover": {
      border: `1px solid ${colors.BLUE()}`,
    },
  },
  multiTagLabelStyle: {
    color: colors.PURPLE(1),
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputFieldContainer: {
    width: "100%",
    fontSize: 16,
    fontWeight: 300,
  },
  saveIcon: {
    height: 32,
    width: 32,
    fontSize: 12,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: colors.BLUE(),
    color: "#FFF",
    position: "absolute",
    right: 5,
  },
  editIcon: {
    cursor: "pointer",
    borderRadius: "50%",
    color: "#afb5bc",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: 32,
    ":hover": {
      color: colors.BLACK(),
      backgroundColor: "#EDEDED",
    },
  },
  formContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    marginTop: 5,
  },
  inputStyles: {
    padding: 0,
    margin: 0,
    minHeight: "unset",
    width: "calc(100% - 32px)",
  },
  input: {
    width: "100%",
  },
  optOut: {
    fontWeight: 400,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(UserApiTokenInputField);
