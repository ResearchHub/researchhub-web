import { authenticateToken } from "./api/authorClaimValidateToken";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { getPageBody } from "./util";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { VALIDATION_STATE } from "./constants";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function AuthorClaimValidation() {
  const [validationState, setValidationState] = useState(null);

  const pageBody = useMemo(() => getPageBody(validationState), [
    getPageBody,
    validationState,
  ]);

  const onValidationError = useCallback(
    ({ error, validationState }) => {
      emptyFncWithMsg(error);
      setValidationState(validationState || VALIDATION_STATE.LOADING);
    },
    [setValidationState]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search || "");
    const token = urlParams.get("token");
    if (isNullOrUndefined(token) || token.length < 1) {
      setValidationState(VALIDATION_STATE.REQUEST_NOT_FOUND);
    } else if (isNullOrUndefined(validationState)) {
      setValidationState(VALIDATION_STATE.LOADING);
      authenticateToken({
        onError: onValidationError,
        onSuccess: () => setValidationState(VALIDATION_STATE.VALIDATED),
        token,
      });
    }
  }, [setValidationState, validationState]);

  return <div className={css(styles.authorClaimValidation)}>{pageBody}</div>;
}

const styles = StyleSheet.create({
  authorClaimValidation: {
    height: "100vh",
    padding: 16,
    width: "100%",
  },
});
