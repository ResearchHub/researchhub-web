import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import gatekeeper from "./gatekeeper";

export default function gateKeepCurrentUser(
  application: string,
  reduxStore: any
): boolean {
  const router = useRouter();
  const auth = reduxStore.getState().auth ?? null;
  const { user } = auth ?? {};
  const isReadyToCheck =
    !isNullOrUndefined(auth) && !isNullOrUndefined(user?.id);
  const isLoggedIn = Boolean(auth?.isLoggedIn);
  const isInGatekeeper = gatekeeper(application, user?.email) ?? false;

  useEffect(() => {
    /*  sending back inappropriate user to home
        intentional boolean checks as below since redux propagates in the clientside */
    if (isReadyToCheck && (!isInGatekeeper || !isLoggedIn)) {
      router.push("/");
    }
  }, [isInGatekeeper, isLoggedIn, isReadyToCheck]);

  return isInGatekeeper;
}
