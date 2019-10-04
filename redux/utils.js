import { logFetchError } from "~/config/utils";

export function handleCatch(err) {
  console.log(FETCH_ERROR_MESSAGE, err);
  return err;
}

export function dispatchResult(response, dispatch, failure, success) {
  if (!response.ok) {
    logFetchError(response);
    return dispatch(failure);
  } else {
    return dispatch(success);
  }
}
