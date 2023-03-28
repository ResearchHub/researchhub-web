import { isEmpty } from "./nullchecks";
// import { parseUser, RHUser } from "../types/root_types";
// import { RootState } from "~/redux";
// import { useSelector } from "react-redux";

// type ReturnType = RHUser | null;

// export function getCurrentUser(): ReturnType {
//   return useSelector((state: RootState): ReturnType => {
//     const { user } = state?.auth ?? {};
//     return isEmpty(user?.id) ? null : parseUser(user);
//   });
// }

import { useStore } from "react-redux";

/**
 * @deprecated use useSelector to fetch user directly from state instead. Using this method will result in old state
 */
export function getCurrentUser() {
  return useStore()?.getState()?.auth?.user;
}
