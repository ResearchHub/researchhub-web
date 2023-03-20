import { useStore } from "react-redux";

/**
 * @deprecated use useSelector to fetch user directly from state instead. Using this method will result in old state
 */
export function getCurrentUser() {
  return useStore()?.getState()?.auth?.user;
}
