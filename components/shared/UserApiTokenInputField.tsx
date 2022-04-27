import { captureEvent } from "@sentry/nextjs";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { Helpers } from "@quantfive/js-web-config";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import API from "~/config/api";
import colors from "~/config/themes/colors";
import FormInput from "../Form/FormInput";
import icons from "~/config/themes/icons";
import Loader from "../Loader/Loader";
import Ripples from "react-ripples";
import { copyInputValToClipboard } from "~/config/utils/copyInputValToClipboard";

const USER_API_TOKEN_INPUT_ID = "USER_API_TOKEN_INPUT_ID";

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
  const [copyButtonStatus, setCopyButtonStatus] = useState<
    "copied" | null | "ready"
  >(null);

  useEffectGetUserApiToken({ isLoggedIn, setApiToken, setIsLoading });

  const { token, prefix } = apiToken ?? {};
  const userHasApiToken = !isLoading && (!isEmpty(token) || !isEmpty(prefix));

  const handleCopy = (event: SyntheticEvent): void => {
    event?.preventDefault();
    const result = copyInputValToClipboard({
      inputID: USER_API_TOKEN_INPUT_ID,
    });
    if (result) {
      setCopyButtonStatus("copied");
      setTimeout(
        (): void => setCopyButtonStatus("ready"),
        2000 /* 2 seconds */
      );
    }
  };

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
        setCopyButtonStatus(!userHasApiToken ? "ready" : null);
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
            id={USER_API_TOKEN_INPUT_ID}
            inputStyle={styles.input}
            placeholder={
              isLoading
                ? "Getting Api token ..."
                : "Click the plus button to create a token"
            }
            value={displayableValue}
          />
          {copyButtonStatus && (
            <div className={css(styles.copyButtonTextStatus)}>
              {
                "Please copy your API Token. You won't be able to copy it again after exiting this page"
              }
            </div>
          )}
          <Ripples
            className={css(styles.saveIcon)}
            role="button"
            onClick={copyButtonStatus ? handleCopy : handleSubmit}
          >
            {isLoading ? (
              <Loader size={12} color={colors.TOOLTIP_TEXT_COLOR_WHITE} />
            ) : copyButtonStatus === "ready" ? (
              icons.file
            ) : copyButtonStatus === "copied" ? (
              icons.checkCircle
            ) : userHasApiToken ? (
              icons.times
            ) : (
              icons.plusCircleSolid
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
    top: 10,
  },
  formContainer: {
    display: "flex",
    alignItems: "flex-start",
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
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
  copyButtonTextStatus: {
    color: colors.RED(1),
    marginTop: 4,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(UserApiTokenInputField);
