import { isEmpty } from "./nullchecks";
import { RHUser, parseUser } from "../types/root_types";
import { RootState } from "~/redux";
import { useSelector } from "react-redux";

export function getCurrentUser(): RHUser | null {
  return useSelector((state: RootState): RHUser | null => {
    const { user } = state?.auth ?? {};
    return isEmpty(user) ? null : parseUser(user);
  });
}
