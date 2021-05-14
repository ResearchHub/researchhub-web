// import {}
import Loader from "~/components/Loader/Loader";
import React, { useMemo, useState } from "react";
import colors from "~/config/themes/colors";

const VALIDATION_STATE = {
  LOADING: "LOADING",
  REQUEST_NOT_FOUND: "REQUEST_NOT_FOUND",
  DENIED_TOO_MANY_ATTEMPS: "DENIED_TOO_MANY_ATTEMPS",
  VALIDATED: "VALIDATED",
};

const getPageBody = (validationState) => {
  switch (validationState) {
    case VALIDATION_STATE.LOADING:
    default:
      return (
        <div>
          <span>
            <Loader color={colors.BLUE(1)} loading size={12} />
          </span>
          <span>{" Please be patient while we validate your request"}</span>
        </div>
      );
  }
};

export default function AuthorClaimValidation() {
  const [validationState, setValidationState] = useState(
    VALIDATION_STATE.LOADING
  );
  const pageBody = useMemo(() => getPageBody(validationState), [
    getPageBody,
    validationState,
  ]);
  return <div>{pageBody}</div>;
}
