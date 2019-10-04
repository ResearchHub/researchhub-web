export { logFetchError } from "~/config/utils";

const FETCH_ERROR_MESSAGE = "Fetch error caught in promise";

export function handleCatch(err) {
  console.log(FETCH_ERROR_MESSAGE, err);
  return err;
}
